pragma solidity ^0.4.23;

contract SmartStaking {
    address public owner;
    uint256 public fund = 0; // total fund investor desposit
    uint256 public fundBonus = 0; // total fundBonus owner or volunteering desposit

    uint256 constant PACKAGE1 = 1;
    uint256 constant PACKAGE2 = 2;
    uint256 constant PACKAGE3 = 3;
    uint256 constant PACKAGE4 = 4;

    uint256 constant PACKAGE1_PERIOD = 1 minutes; // should be 7 days in mainnet
    uint256 constant PACKAGE2_PERIOD = 2 minutes; // should be 30 days in mainnet
    uint256 constant PACKAGE3_PERIOD = 3 minutes; // should be 90 days in mainnet
    uint256 constant PACKAGE4_PERIOD = 5 minutes; // should be 180 days in mainnet

    uint256 constant LOCK_PERIOD = 1 minutes; // should be 7 days in mainnet
    uint256 constant STAKING_MIN_AMOUNT = 0.01 ether; // should be 50 pNTY ~ 500,000 NTY/ether in mainnet
    uint256 constant REWARD_TIME_UNIT = 1 minutes; // should be 1 days in mainnet

    struct InvestorPackage {
        bool isPaid;
        uint256 amount;
        uint256 packageId;
        uint256 bonusPercent;
        uint256 expiredDate;
        uint256 lastDateWithdraw;
    }

    struct Package {
        uint256 totalDays;
        uint256 bonusPercent;
    }

    mapping(uint256 => Package) public packages;
    mapping(address => InvestorPackage[]) public investorPackages;

    function () external payable {
        if (msg.data.length == 0) {
            fundBonus = safeAdd(fundBonus, msg.value);
            return;
        }
        uint256 dataPackageId = uint256(bytesToBytes32(msg.data, 0));

        if (PACKAGE1 == dataPackageId) {
            processStaking(PACKAGE1);
        } else if (PACKAGE2 == dataPackageId) {
            processStaking(PACKAGE2);
        } else if (PACKAGE3 == dataPackageId) {
            processStaking(PACKAGE3);
        } else if (PACKAGE4 == dataPackageId) {
            processStaking(PACKAGE4);
        } else {
            fundBonus = safeAdd(fundBonus, msg.value);
        }
    }

    function despositBonus() public payable {
        fundBonus = safeAdd(fundBonus, msg.value);
    }

    function bytesToBytes32(bytes b, uint offset) private pure returns (bytes32) {
        bytes32 out;
        uint256 length = b.length;
        if (length > 32) {
            length = 32;
        }
        for (uint i = 0; i < length; i++) {
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
        return out;
    }

    /**
    * Setup packages
    * totalDays 7, 30, 90, 180
    */
    function setupPackage1(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE1].totalDays = PACKAGE1_PERIOD;
        packages[PACKAGE1].bonusPercent = _bonusPercent;
    }

    function setupPackage2(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE2].totalDays = PACKAGE2_PERIOD;
        packages[PACKAGE2].bonusPercent = _bonusPercent;
    }

    function setupPackage3(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE3].totalDays = PACKAGE3_PERIOD;
        packages[PACKAGE3].bonusPercent = _bonusPercent;
    }

    function setupPackage4(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE4].totalDays = PACKAGE4_PERIOD;
        packages[PACKAGE4].bonusPercent = _bonusPercent;
    }

    function processStaking(uint256 _package) internal {
        uint256 bonusAmount = safeDiv(safeMul(msg.value, packages[_package].bonusPercent), 10000);
        require(msg.value >= STAKING_MIN_AMOUNT);
        require(fundBonus >= bonusAmount);

        fundBonus = safeSub(fundBonus, bonusAmount);
        fund = safeAdd(fund, msg.value);

        investorPackages[msg.sender].push(InvestorPackage({
            isPaid: false,
            amount: msg.value,
            packageId: _package,
            bonusPercent: packages[_package].bonusPercent,
            lastDateWithdraw: safeAdd(now, LOCK_PERIOD),
            expiredDate: safeAdd(now, safeAdd(packages[_package].totalDays, LOCK_PERIOD))
        }));
    }

    /**
    * Handle withdraw bonus with package for Investor
    */
    function withdrawBonusPackage(uint256 _id) public payable {
        require(_id < investorPackages[msg.sender].length);
        InvestorPackage package = investorPackages[msg.sender][_id];
        require(safeSub(now, package.lastDateWithdraw) > REWARD_TIME_UNIT);
        require(!package.isPaid);

        uint256 amountBonusPackage = safeDiv(safeMul(package.amount, package.bonusPercent), 10000);
        uint256 bonusPerday = safeDiv(amountBonusPackage, safeDiv(packages[package.packageId].totalDays, 1 minutes));
        uint256 sumDays;
        uint256 packageAmount = package.amount;
        uint256 expiredDate = package.expiredDate;
        uint256 amount = 0;

        if (package.expiredDate > now) {
            sumDays = safeDiv(safeSub(now, package.lastDateWithdraw), REWARD_TIME_UNIT);
            package.lastDateWithdraw = now;
            amount = safeMul(sumDays, bonusPerday);
        }

        if (package.expiredDate <= now) {
            sumDays = safeDiv(safeSub(expiredDate, package.lastDateWithdraw), REWARD_TIME_UNIT);
            package.lastDateWithdraw = now;

            fund = safeSub(fund, packageAmount);
            package.isPaid = true;
            amount = safeAdd(packageAmount, safeMul(sumDays, bonusPerday));
        }

        if (amount > 0) {
            msg.sender.transfer(amount);
        }
    }

    function getPackageCount() public view returns(uint256) {
        return investorPackages[msg.sender].length;
    }

    /**
    * Get package info for Investor
    */
    function getPackageInfo(uint256 _id) public view returns(
        bool,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256) {
        require(investorPackages[msg.sender].length > 0);
        InvestorPackage package = investorPackages[msg.sender][_id];

        return (
            package.isPaid,
            package.amount,
            package.packageId,
            package.bonusPercent,
            package.lastDateWithdraw,
            package.expiredDate
        );
    }

    constructor() public {
        owner = msg.sender;
    }

    /**
    * Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
    * Allows the current owner to transfer control of the contract to a newOwner.
    * _newOwner The address to transfer ownership to.
    */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != owner);
        require(_newOwner != address(0x0));
        owner = _newOwner;
    }

    /**
    * SafeMath
    * Math operations with safety checks that throw on error
    */
    function safeMul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function safeDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }

    function safeSub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(a >= b);
        return a - b;
    }

    function safeAdd(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}
