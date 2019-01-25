const SimpleBet = artifacts.require("./SimpleBet.sol");
const truffleAssert = require('truffle-assertions');

/// @author Colin McCrae, colin.mccrae@gmail.com 
/// @title final-project-colinmccrae: SimpleBet.Test
contract("SimpleBet", accounts => {
  
  /// @dev Test 1
  /// @dev Ensure contract pauses when instructed using OpenZeppelin inheritied contract 'Pausable.sol'
  it("...should pause when instructed.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    /// @dev Pause contract using OpenZeppelin inheritied contract
    await simpleBetInstance.pause( { from: accounts[0] });

    /// @dev Save paused status (using OpenZeppelin inheritied contract) into variable contractIsPaused
    const contractIsPaused = await simpleBetInstance.paused.call ();

    // assert.equal(contractIsPaused, true, "The contract does not pause.");
    /// @dev Check that paused status is true (contract is paused)    
    assert.isTrue(contractIsPaused, "The contract does not pause.");
  });

  /// @dev Test 2
  /// @dev Ensure contract unpauses when instructed using OpenZeppelin inheritied contract 'Pausable.sol'
  it("...should unpause when instructed.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    /// @dev Unpause contract using OpenZeppelin inheritied contract
    await simpleBetInstance.unpause( { from: accounts[0] });

    /// @dev Save paused status (using OpenZeppelin inheritied contract) into variable contractIsPaused
    const contractIsPaused = await simpleBetInstance.paused.call ();

    /// @dev Check that paused status is false (contract is unpaused)    
    assert.isFalse(contractIsPaused, "The contract does not unpause.");
  });

  /// @dev Test 3
  /// @dev Ensure contract does not allow bets below the minimum required size
  it("...should not allow bets smaller than minBet.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    /// @dev Place bet that is too small (< 0.01 ETH)
    const amountToBet = 0.001 * 10**18;
    await truffleAssert.reverts(simpleBetInstance.placeBet(true, { from: accounts[0], value: amountToBet } ));
  });

  /// @dev Test 4
  /// @dev Test to ensure contract does not allow bets above the maximum required size
  it("...should not allow bets larger than maxBet.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    /// @dev  Place bet that is too big (> 1 ETH)
    const amountToBet = 2 * 10**18;
    const amountReturned = await simpleBetInstance.checkBetValue( { from: accounts[0], value: amountToBet });

    /// @dev Check that bet size has been changed from oversized      
    assert.notEqual(amountToBet, amountReturned, "The contract allows oversized bets.");
  });

  /// @dev Test 5
  /// @dev Test to ensure contract fires an event when the bankroll is updated
  it('...should fire an event when bankroll is updated', async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    /// @dev Add 1 ETH to bankroll 
    const amountToAdd = 1 * 10**18;
    const result = await simpleBetInstance.addBankroll({ from: accounts[0], value: amountToAdd });

    truffleAssert.eventEmitted(result, 'bankrollUpdated');
  });

  // /// @dev Test 6
  // /// @dev Test to ensure fallbank function makes a heads bet (bet.input = true)
  // it('...should place a heads bet (true) when the fallback function is called', async () => {
  //   const simpleBetInstance = await SimpleBet.deployed();

  //   const initialBetInput = simpleBetInstance.call.bet.input;
  //   /// @dev  Place a 0.5 ETH bet
  //   const amountToBet = 0.5 * 10**18;
  //   /// @dev Send a bet to the contract with no function called, so bet is undefined 
  //   await simpleBetInstance({ from: accounts[0], value: amountToBet });
    
  //   const finalBetInput = simpleBetInstance.call.bet.input;

  //   assert.isTrue(finalBetInput, "The fallback function doesn't make a heads bet (bet.input = true)");
  // });

});
