pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract SimpleBet is Ownable, Pausable {

    // Game and Global Variables
    uint8 public blockDelay; // How many blocks to wait to resolve RNG and allow payout
    uint8 public blockExpiration; // How many blocks until bet expires
    uint256 public maxBet; // Minimum bet size
    uint256 public minBet; // Maximum bet size

    // Record Bets in Struct
    struct Bet {
        address player;
        bool rngResolved;
        bool win;
        bool input; // Stores bettor input
        uint256 wager;
        uint256 blockNumber; //block of bet
        uint256 blockResolved; //block of spin
        uint8 betResult;
    }

    Bet[] private bet;
    
    //records current status of player
    enum Status {waitingForBet, waitingForResolved}


    // Constructor with contract deployment inital settings 
    constructor() public {    
        blockDelay = 0;          // How many blocks to wait to resolve RNG and allow payout
        blockExpiration = 100;    // How many blocks until bet expires
        minBet = 10 finney;        // Minimum bet size (1 Ether = 1,000 Finney)
        maxBet = 1000 finney;     // Maximum bet size (1 Ether = 1,000 Finney)

    }


    function addBankroll() public payable 
        onlyOwner
        whenNotPaused {
    }

    // Enable and disable betting
    enum States{active, inactive}
    States private contract_state;
    
    function disableBetting_only_Owner() public
        onlyOwner 
        whenNotPaused {
    }

    function enableBetting_only_Owner() public
        onlyOwner
        whenNotPaused {
        contract_state = States.active;
    }

    modifier onlyActive() {
        require (contract_state!=States.inactive, "Contract inactive.");
        _;
    }


}
