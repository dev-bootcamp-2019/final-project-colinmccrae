const SimpleBet = artifacts.require("./SimpleBet.sol");

/// @author Colin McCrae, colin.mccrae@gmail.com 
/// @title final-project-colinmccrae: SimpleBet.Test
contract("SimpleBet", accounts => {
  
  /// @dev Test 1
  /// @dev Test to ensure contract pauses when instructed using OpenZeppelin inheritied contract 'Pausable.sol'
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
  /// @dev Test to ensure contract unpauses when instructed using OpenZeppelin inheritied contract 'Pausable.sol'
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
  /// @dev Test to ensure contract does not allow bets below the minimum required size
  it("...should not allow bets smaller than minBet.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    /// @dev Place bet that is too small (< 0.01 ETH)
    const amountToBet = 0.001 * 10**18;
    await simpleBetInstance.placeBet( true, { from: accounts[0], value: amountToBet });

    // assert.equal(contractIsPaused, true, "The contract does not pause.");
    /// @dev Check that bet size has been changed from undersized    
    assert.notEqual(amountToBet, amountReturned, "The contract allows undersized bets.");
  });

  /// @dev Test 4
  /// @dev Test to ensure contract does not allow bets above the maximum required size
  it("...should not allow bets larger than maxBet.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    /// @dev  Place bet that is too big (> 1 ETH)
    const amountToBet = 2 * 10**18;
    await simpleBetInstance.placeBet( true, { from: accounts[0], value: amountToBet });

    /// @dev Check that bet size has been changed from oversized      
    assert.notEqual(amountToBet, amountReturned, "The contract allows oversized bets.");
  });







});
