pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

/// @author Colin McCrae, colin.mccrae@gmail.com
/// @title final-project-colinmccrae: SimpleBet
/// @dev Contract SimpleBet will inherit the contracts Ownable and Pausable from the OpenZeppelin libarary (/node_modules/openzeppelin-solidity/contracts) 
contract SimpleBet is Ownable, Pausable {

    // Game and global variables
    // blockDelay How many blocks to wait to resolve RNG and allow payout
    // blockExpiration How many blocks until bet expires
    // maxBet Minimum bet size
    // minBet Maximum bet size
    uint8 public blockDelay;
    uint8 public blockExpiration;
    uint256 public maxBet;
    uint256 public minBet;

    // Record bets in a struct
    // Bet.player Address of player
    // Bet.resolved Has the bet been resolved yet?
    // Bet.win Is the bet a winning bet?
    // Bet.input User's bet (heads or tails)
    // Bet.betSize User's bet size
    // Bet.blockBet The block number the bet is placed 
    // Bet.blockResolved The block number the bet is resolved
    // Bet.betResult The result of the random number generation
    struct Bet {
        address player;
        bool resolved;
        bool win;
        bool input;
        uint256 betSize;
        uint256 blockBet;
        uint256 blockResolved;
        bool betResult;
    }
    Bet private bet;
    
    // Tracks the current bet status
    enum Status {waitingForBet, waitingForResolve}
    // playerStatus.waitingForBet Contract is ready to accept a bet
    // playerStatus.waitingForResolve Contract is ready to resolve a bet
    Status private playerStatus;

    /// @dev Constructor with contract deployment inital settings 
    // blockDelay How many blocks to wait to resolve RNG and allow payout
    // blockExpiration How many blocks until bet expires
    // minBet Minimum bet size (1 Ether = 1,000 Finney)
    // maxBet Maximum bet size (1 Ether = 1,000 Finney)
    constructor() public {
        blockDelay = 0;
        blockExpiration = 100;
        minBet = 10 finney;
        maxBet = 1000 finney;
    }

    /// @dev The owner can add more bankroll to the contract when the contract is not paused (even if betting is disabled)
    function addBankroll() public payable 
        onlyOwner
        whenNotPaused {
    }

    // An emum which keeps track of whether betting is enabled or disabled
    enum States{active, inactive}
    // contract_state.active Betting enabled
    // contract_state.inactive Betting disabled
    States private contract_state;
    
    /// @dev Owner is able to disable betting when the contract is not paused
    function disableBetting_only_Owner() public
        onlyOwner 
        whenNotPaused {
        contract_state = States.inactive;
    }

    /// @dev Owner is able to enable betting when the contract is not paused
    function enableBetting_only_Owner() public
        onlyOwner
        whenNotPaused {
        contract_state = States.active;
    }

    /// @dev A modifier that requires the betting to be enabled
    modifier onlyActive() {
        require (contract_state!=States.inactive, "Betting disabled.");
        _;
    }

    /// @dev The fallback function (if player doesn't specify heads or tails) makes the default bet true (heads)
    function () external payable
        {
        bet.input = true;
    } 

    /// @dev Function ensures the bet size is in the valid range
    /// @return playerBetValue The accepted bet value   
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

    /// @dev Fuction records the bet details. To be public as it will be called by the user.
    /// @dev User sends Ether as the bet. This function only works when betting is enabled, and contract not paused.  
    /// @param input_ The user's bet (true = heads, false = tails) 
    function placeBet(bool input_) public 
        payable
        onlyActive
        whenNotPaused {
        if (playerStatus == Status.waitingForBet) {
            resolveBet(msg.sender);
        }
        /// @dev Update contract status from waiting for bet to waiting for resolve.
        playerStatus = Status.waitingForResolve;

        /// @dev Ensure bet size is in range
        uint256 betValue = checkBetValue();
        
        /// @param Bet(player address, resolved, win, input, betSize, blockBet, blockResoved, betResult)
        bet = Bet(msg.sender, false, false, input_, betValue, block.number, 0, false);

        /// @dev Refund excess bet to user (do this at the very last step of the function to prevent a re-entrancy attack)
        if (betValue < msg.value) {
            msg.sender.transfer(msg.value - betValue);
        }
    }

    /// @dev Fuction resolves the bet.
    /// @param playerBet Address of player who has made the bet
    function resolveBet(address playerBet) private {

    }






}
