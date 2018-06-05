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

    mapping(uint256 => Package) public package;
    mapping(address => InvestorPackages[]) public investorPackges;

    /**
    * Deposit for fund bonnus onlyOwner or volunteering
    */
    function depositFundBonusForOwner() public payable {
        fundBonus = safeAdd(fundBonus, msg.value);
    }

    /**
    * Setup packages
    * totalDays 7, 30, 90, 365
    */
    function setupPackage1(uint256 _bonusPercent) public onlyOwner {
        package[PACKAGE1].totalDays = 7 days;
        package[PACKAGE1].bonusPercent = _bonusPercent;
    }

    function setupPackage2(uint256 _bonusPercent) public onlyOwner {
        package[PACKAGE2].totalDays = 30 days;
        package[PACKAGE2].bonusPercent = _bonusPercent;
    }

    function setupPackage3(uint256 _bonusPercent) public onlyOwner {
        package[PACKAGE3].totalDays = 90 days;
        package[PACKAGE3].bonusPercent = _bonusPercent;
    }

    function setupPackage4(uint256 _bonusPercent) public onlyOwner {
        package[PACKAGE4].totalDays = 365 days;
        package[PACKAGE4].bonusPercent = _bonusPercent;
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
        uint256 bonusAmount = safeAdd(msg.value, safeDiv(package[_package].bonusPercent, 100));
        require(msg.value >= 1);
        require(fundBonus >= bonusAmount);

        fund = safeAdd(fund, msg.value);
        investors.push(msg.sender);

        investorPackges[msg.sender].push(InvestorPackages({
            amount: msg.value,
            bonus: 0,
            package: _package,
            bonusPercent: package[_package].bonusPercent,
            expiredTimes: safeAdd(package[_package].totalDays, INIT_TIMES)
        }));

        fundBonus = safeSub(fundBonus, bonusAmount);
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
