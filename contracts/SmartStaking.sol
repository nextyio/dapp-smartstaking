pragma solidity ^0.4.20;

contract SmartStaking {
    address owner;
    uint256 public constant PACKAGE1 = 1;
    uint256 public constant PACKAGE2 = 2;
    uint256 public constant PACKAGE3 = 3;
    uint256 public constant PACKAGE4 = 4;
    uint256 public constant INIT_DATE = 1 minutes;
    uint256 public constant MIN_AMOUNT_STAKING = 1 ether;
    uint256 public fund = 0; // total fund investor desposit
    uint256 public fundBonus = 0; // total fundBonus owner or volunteering desposit
    address[] public investors;
    string public data;
    uint256 public packageId1;
    uint256 public packageId2;
    uint256 public packageId3;

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
    mapping(address => InvestorPackage[]) public investorPackges;

    /**
    * Deposit for fund bonnus onlyOwner or volunteering
    */
    function depositFundBonus() public payable {
        fundBonus = safeAdd(fundBonus, msg.value);
    }

    function () public payable {
        fundBonus = safeAdd(fundBonus, msg.value);
        packageId1 = uint256(bytesToBytes32(msg.data, 0));

        // if (uint256(0x0) == uint256(bytesToBytes32(msg.data, 0))) {
        //     packageId1 = 0;
        // }
    }

    function bytesToBytes32(bytes b, uint offset) private pure returns (bytes32) {
        bytes32 out;

        for (uint i = 0; i < 32; i++) {
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
        return out;
    }

    /**
    * Setup packages
    * totalDays 7, 30, 90, 180
    */
    function setupPackage1(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE1].totalDays = 1 minutes;
        packages[PACKAGE1].bonusPercent = _bonusPercent;
    }

    function setupPackage2(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE2].totalDays = 2 minutes;
        packages[PACKAGE2].bonusPercent = _bonusPercent;
    }

    function setupPackage3(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE3].totalDays = 3 minutes;
        packages[PACKAGE3].bonusPercent = _bonusPercent;
    }

    function setupPackage4(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE4].totalDays = 5 minutes;
        packages[PACKAGE4].bonusPercent = _bonusPercent;
    }

    /**
    * Deposit and smart staking for investor
    */
    function depositPackage1() public payable {
        processStaking(PACKAGE1);
    }

    function depositPackage2() public payable {
        processStaking(PACKAGE2);
    }

    function depositPackage3() public payable {
        processStaking(PACKAGE3);
    }

    function depositPackage4() public payable {
        processStaking(PACKAGE4);
    }

    function processStaking(uint256 _package) private returns(bool){
        uint256 bonusAmount = safeDiv(safeMul(msg.value, packages[_package].bonusPercent), 100);
        require(msg.value >= MIN_AMOUNT_STAKING);
        require(fundBonus >= bonusAmount);

        fundBonus = safeSub(fundBonus, bonusAmount);
        fund = safeAdd(fund, msg.value);
        investors.push(msg.sender);

        investorPackges[msg.sender].push(InvestorPackage({
            isPaid: false,
            amount: msg.value,
            packageId: _package,
            bonusPercent: packages[_package].bonusPercent,
            lastDateWithdraw: safeAdd(now, INIT_DATE),
            expiredDate: safeAdd(now, safeAdd(packages[_package].totalDays, INIT_DATE))
        }));

        return true;
    }

    /**
    * Handle withdraw bonus with package for Investor
    */
    function withdrawBonusPackage(uint256 _id) public payable returns(bool) {
        InvestorPackage package = investorPackges[msg.sender][_id];
        require(safeSub(now, package.lastDateWithdraw) > 1 minutes);
        require(!package.isPaid);

        uint256 amountBonusPackage = safeDiv(safeMul(package.amount, package.bonusPercent), 100);
        uint256 bonusPerday = safeDiv(amountBonusPackage, safeDiv(packages[package.packageId].totalDays, 1 minutes));
        uint256 sum;
        uint256 nowDate = now;
        uint256 expiredDate = package.expiredDate;

        if (package.expiredDate > now) {
            sum = safeDiv(safeSub(now, package.lastDateWithdraw), 1 minutes);
            package.lastDateWithdraw = now;
            msg.sender.transfer(safeMul(sum, bonusPerday));
        }

        if (package.expiredDate <= now) {
            sum = safeDiv(safeSub(package.expiredDate, package.lastDateWithdraw), 1 minutes);
            package.lastDateWithdraw = now;
            msg.sender.transfer(safeMul(sum, bonusPerday));

            fund = safeSub(fund, package.amount);
            package.isPaid = true;
            msg.sender.transfer(package.amount);
        }

        return true;
    }

    function getPackageCount() public constant returns(uint256) {
        return investorPackges[msg.sender].length;
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
        require(investorPackges[msg.sender].length > 0);
        InvestorPackage package = investorPackges[msg.sender][_id];

        return (
            package.isPaid,
            package.amount,
            package.packageId,
            package.bonusPercent,
            package.lastDateWithdraw,
            package.expiredDate
        );
    }

    function SmartStaking() public {
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
