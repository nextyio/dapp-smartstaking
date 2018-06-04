pragma solidity ^0.4.20;

contract SmartStaking {
    address owner;
    uint256 public constant PACKAGE1 = 1;
    uint256 public constant PACKAGE2 = 2;
    uint256 public constant PACKAGE3 = 3;
    uint256 public constant PACKAGE4 = 4;
    uint256 public constant INIT_TIMES = 7 days;
    uint256 public fund;
    uint256 public fundBonus;

    struct Investor {
        uint256 amount;
        uint256 bonus;
    }

    struct Package {
        uint256 totalDays;
        uint256 bonusPercent;
    }

    mapping(uint256 => Package) public package;

    /**
    * packageName only 1, 2, 3, 4 corresponding PACKAGE7, PACKAGE30, PACKAGE90, PACKAGE365
    * totalDays number 7, 30, 90, 365
    */
    function setupPackage(uint256 _packageName, uint256 _totalDays, uint256 _bonusPercent) public onlyOwner {
        package[_packageName].totalDays = _totalDays;
        package[_packageName].bonusPercent = _bonusPercent;
    }

    function SmartStaking() public {
        owner = msg.sender;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param _newOwner The address to transfer ownership to.
    */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != owner);
        owner = _newOwner;
    }

    /**
    * @title SafeMath
    * @dev Math operations with safety checks that throw on error
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

    /**
    * deposit for player call
    */
    // function deposit() public payable {
    //     require(msg.value >= ROOM1_VALUE);
    //     playerInfo[msg.sender].amount += msg.value;
    //     playerInfo[msg.sender].isLock = false;
    // }
}
