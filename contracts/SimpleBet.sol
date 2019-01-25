pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

/// @author Colin McCrae, colin.mccrae@gmail.com
/// @title final-project-colinmccrae: SimpleBet
/// @dev Contract SimpleBet will inherit the contracts Ownable and Pausable from the OpenZeppelin libarary (/node_modules/openzeppelin-solidity/contracts)
/// @dev Pausable is a circuit breaker which blocks all contract functions expect withdrawl by the owner 
contract SimpleBet is Ownable, Pausable {

    // Game and global variables
    // maxBet Minimum bet size
    // minBet Maximum bet size
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
        address payable player;
        bool resolved;
        bool win;
        bool input;
        uint256 betSize;
        uint256 blockBet;
        uint256 blockResolved;
        bool betResult;
    }
    Bet public bet;
    
    // Tracks the current bet status
    enum Status {waitingForBet, waitingForResolve}
    // playerStatus.waitingForBet Contract is ready to accept a bet
    // playerStatus.waitingForResolve Contract is ready to resolve a bet
    Status private playerStatus;

    event bankrollUpdated(uint _newBankroll);
    event winBet(address _betAddress, uint _betSize);
    event looseBet(address _betAddress, uint _betSize);
    
    /// @dev Constructor with contract deployment inital settings 
    // minBet Minimum bet size (10 finney = 0.01 ether )
    // maxBet Maximum bet size (10,000 finney = 10 ether)
    constructor() public {
        minBet = 10 finney;
        maxBet = 10000 finney;
    }

    /// @dev The fallback function (if player doesn't specify heads or tails) makes the default bet true (heads)
    function () external payable
        {
        bet.input = true;
    } 

    /// @dev The owner can add more bankroll to the contract when the contract is not paused (even if betting is disabled)
    function addBankroll() public payable 
        onlyOwner
        whenNotPaused {
        emit bankrollUpdated(address(this).balance);   
    }

    /// @dev The owner can add more bankroll to the contract when the contract is not paused (even if betting is disabled)
    /// @param amount Value to be withdrawn in wei
    function withdrawBankroll(uint amount) public 
        onlyOwner {
        msg.sender.transfer(amount);
        emit bankrollUpdated(address(this).balance);  
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

    /// @dev Function ensures the bet size is in the valid range
    /// @return playerBetValue The accepted bet value   
    function checkBetValue() public payable returns(uint256) {
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
        require (playerStatus != Status.waitingForResolve, "Previous bet has not been resolved.");

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
    function resolveBet(address payable playerBet) public payable {
        // Check that a bet has been made to resolve
        require(playerStatus == Status.waitingForResolve, "No bet placed to resolve");
        require(playerBet == bet.player, "No pending bets for this address");
	    // Get a pseudorandom number from the hash of four paramters
        bytes32 _pseudoRandomResult = keccak256 (abi.encodePacked(msg.sender, msg.data, msg.value, block.number));
        
        // Security check to ensure the pseudorandom number is not empty or zero
        require (_pseudoRandomResult != 0, "Blockhash is 0");
        
        // Determine heads or tails (true or false) using modulo division
        bet.betResult = uint256(_pseudoRandomResult) % 2 == 0;

        // Update status and record result
        playerStatus = Status.waitingForBet;
        bet.resolved = true;
        bet.blockResolved = block.number;
	
        if (bet.input == bet.betResult) {
            bet.win = true;
            playerBet.transfer(2 * bet.betSize);
//            playerBet.transfer(2 * bet.betSize * 10**18);
            emit winBet(playerBet, bet.betSize);
        }
        else {
            emit looseBet(playerBet, bet.betSize);  
        }
    }

//    function getStatus() public returns () {


}
