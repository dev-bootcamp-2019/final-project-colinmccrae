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
        bool betResult;
    }
    Bet private bet;
    
    //records current status of player
    enum Status {waitingForBet, waitingForResolve}
    Status private playerStatus;

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
        contract_state = States.inactive;
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

    // If player doesn't specify bet, make the default bet true (heads)
    function () external payable // Fallback function
        {
        bet.input = true;
    } 

    // Ensure bet size is in range
    function checkBetValue() private returns(uint256) {
        uint256 playerBetValue;
        require (msg.value >= minBet, "Bet too small.");

        if (msg.value > maxBet){
            playerBetValue = maxBet;
        }
        else {
            playerBetValue = msg.value;
        }
        return playerBetValue;
    }

    // Record the bet details
    function placeBet(bool input_) public 
        payable
        onlyActive
        whenNotPaused {
        if (playerStatus == Status.waitingForBet) {
            resolveBet(msg.sender);
        }
        // Once this is done, we can record the new bet
        playerStatus = Status.waitingForResolve;

        // Ensure bet size is in range
        uint256 betValue = checkBetValue();
        // Bet(player address, rngRevolved, win, input, wager, blockNumber, blockResoved, betResult)
        bet = Bet(msg.sender, false, false, input_, betValue, block.number, 0, false);

        // Refund excess bet to user (do this at the very last step to prevent re-entrancy attack)
        if (betValue < msg.value) {
            msg.sender.transfer(msg.value - betValue);
        }
    }

    function resolveBet(address playerSpun) private {

    }






}
