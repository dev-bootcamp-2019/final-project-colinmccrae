const SimpleBet = artifacts.require("./SimpleBet.sol");

/// @author Colin McCrae, colin.mccrae@gmail.com
/// @title final-project-colinmccrae: SimpleBet.Test
contract("SimpleBet", accounts => {
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





});
