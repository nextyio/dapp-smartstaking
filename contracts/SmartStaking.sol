pragma solidity ^0.4.20;

contract SmartStaking {
    address owner;
    uint256 public constant PACKAGE1 = 1;
    uint256 public constant PACKAGE2 = 2;
    uint256 public constant PACKAGE3 = 3;
    uint256 public constant PACKAGE4 = 4;
    uint256 public constant INIT_TIMES = 7 days;
    uint256 public fund = 0; // total fund investor desposit
    uint256 public fundBonus = 0; // total fundBonus owner or volunteering desposit
    address[] public investors;
    uint256 public bonusAmount = 0;

    struct InvestorPackages {
        uint256 amount;
        uint256 bonus;
        uint256 package;
        uint256 bonusPercent;
        uint256 expiredTimes;
    }

    struct Package {
        uint256 totalDays;
        uint256 bonusPercent;
    }

    mapping(uint256 => Package) public packages;
    mapping(address => InvestorPackages[]) public investorPackges;

    /**
    * Deposit for fund bonnus onlyOwner or volunteering
    */
    function depositFundBonusForOwner() public payable {
        fundBonus = safeAdd(fundBonus, msg.value);
    }

    /**
    * Setup packages
    * totalDays 7, 30, 90, 180
    */
    function setupPackage1(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE1].totalDays = 7 days;
        packages[PACKAGE1].bonusPercent = _bonusPercent;
    }

    function setupPackage2(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE2].totalDays = 30 days;
        packages[PACKAGE2].bonusPercent = _bonusPercent;
    }

    function setupPackage3(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE3].totalDays = 90 days;
        packages[PACKAGE3].bonusPercent = _bonusPercent;
    }

    function setupPackage4(uint256 _bonusPercent) public onlyOwner {
        packages[PACKAGE4].totalDays = 180 days;
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

    function processStaking(uint256 _package) private {
        bonusAmount = safeDiv(safeMul(msg.value, packages[_package].bonusPercent), 100);
        require(msg.value >= 1);
        require(fundBonus >= bonusAmount);

        fundBonus = safeSub(fundBonus, bonusAmount);
        fund = safeAdd(fund, msg.value);
        investors.push(msg.sender);

        investorPackges[msg.sender].push(InvestorPackages({
            amount: msg.value,
            bonus: 0,
            package: _package,
            bonusPercent: packages[_package].bonusPercent,
            expiredTimes: safeAdd(packages[_package].totalDays, INIT_TIMES)
        }));
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
