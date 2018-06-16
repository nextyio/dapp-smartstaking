pragma solidity ^0.4.23;


/**
 * Smart Staking contract
 */
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

    event Withdraw(address _to, uint256 _amount);

    /**
     * @dev fallback function to handle when user send fund the the contract address
     */
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

    /**
     * @dev convert any bytes array to maximum length 32 bytes array
     * if the length of input bytes array `b` < 32 then take the bytes array length
     */
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
        require(_bonusPercent >= 0);
        packages[PACKAGE1].bonusPercent = _bonusPercent;
    }

    function setupPackage2(uint256 _bonusPercent) public onlyOwner {
        require(_bonusPercent >= 0);
        packages[PACKAGE2].bonusPercent = _bonusPercent;
    }

    function setupPackage3(uint256 _bonusPercent) public onlyOwner {
        require(_bonusPercent >= 0);
        packages[PACKAGE3].bonusPercent = _bonusPercent;
    }

    function setupPackage4(uint256 _bonusPercent) public onlyOwner {
        require(_bonusPercent >= 0);
        packages[PACKAGE4].bonusPercent = _bonusPercent;
    }

    /**
     * @dev Onwer can create new smart staking for `_to`
     * before Friday, August 31, 2018 11:59:59 PM
     */
    function createStaking(address _to, uint256 _amount, uint256 _packageId,
            uint256 _bonusPercent, uint256 _expiredDate, uint256 _lastDateWithdraw) public onlyOwner {

        // Only onwer can create new smart staking for `_to` before Friday, August 31, 2018 11:59:59 PM
        require(now <= 1535759999);
        require(_amount >= STAKING_MIN_AMOUNT);
        uint256 bonusAmount = safeDiv(safeMul(_amount, _bonusPercent), 10000);
        require(fundBonus >= bonusAmount);
        require(_packageId >= PACKAGE1);
        require(_packageId <= PACKAGE4);

        fundBonus = safeSub(fundBonus, bonusAmount);
        fund = safeAdd(fund, _amount);

        investorPackages[_to].push(InvestorPackage({
            isPaid: false,
            amount: _amount,
            packageId: _packageId,
            bonusPercent: _bonusPercent,
            lastDateWithdraw: _lastDateWithdraw,
            expiredDate: _expiredDate
        }));
    }

    /**
     * @dev onwer can update specific smart staking for `_to` and `_id`
     * before Friday, August 31, 2018 11:59:59 PM
     */
    function updateStaking(address _to, uint256 _id, bool _isPaid, uint256 _amount, uint256 _packageId,
            uint256 _bonusPercent, uint256 _expiredDate, uint256 _lastDateWithdraw) public onlyOwner {

        // Only onwer can update smart staking for `_to` before Friday, August 31, 2018 11:59:59 PM
        require(now <= 1535759999);
        require(_id < investorPackages[_to].length);
        require(_amount >= STAKING_MIN_AMOUNT);
        require(_packageId >= PACKAGE1);
        require(_packageId <= PACKAGE4);
        uint256 bonusAmount = safeDiv(safeMul(_amount, _bonusPercent), 10000);
        InvestorPackage oldPackage = investorPackages[_to][_id];
        uint256 oldBonus = safeDiv(safeMul(oldPackage.amount, oldPackage.bonusPercent), 10000);
        require((fundBonus + oldBonus) > bonusAmount);

        fundBonus = safeSub(safeAdd(fundBonus, oldBonus), bonusAmount);
        fund = safeAdd(safeSub(fund, oldPackage.amount), _amount);

        oldPackage.isPaid = _isPaid;
        oldPackage.amount = _amount;
        oldPackage.packageId = _packageId;
        oldPackage.bonusPercent = _bonusPercent;
        oldPackage.lastDateWithdraw = _lastDateWithdraw;
        oldPackage.expiredDate = _expiredDate;
    }

    /**
     * @dev create new smart staking package for user when they send fund to the contract
     */
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
            emit Withdraw(msg.sender, amount);
        }
    }

    /**
     * @dev Return total number of smart staking package of sender
     */
    function getPackageCount() public view returns(uint256) {
        return investorPackages[msg.sender].length;
    }

    /**
    * Get specific sender's smart staking package info by `_id`
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

    /**
     * @dev Smart Staking contract constructor
     */
    constructor() public {
        owner = msg.sender;

        packages[PACKAGE1].totalDays = PACKAGE1_PERIOD;
        packages[PACKAGE1].bonusPercent = 0;

        packages[PACKAGE2].totalDays = PACKAGE2_PERIOD;
        packages[PACKAGE2].bonusPercent = 0;

        packages[PACKAGE3].totalDays = PACKAGE3_PERIOD;
        packages[PACKAGE3].bonusPercent = 0;

        packages[PACKAGE4].totalDays = PACKAGE4_PERIOD;
        packages[PACKAGE4].bonusPercent = 0;
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
