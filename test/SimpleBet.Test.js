const SimpleBet = artifacts.require("./SimpleBet.sol");

contract("SimpleBet", accounts => {
  it("...should pause when instructed.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    // Pause contract
    await simpleBetInstance.pause( { from: accounts[0] });

    // Check if paused
    const contractIsPaused = await simpleBetInstance.paused.call ();

    // assert.equal(contractIsPaused, true, "The contract does not pause.");
    assert.isTrue(contractIsPaused, "The contract does not pause.");
  });

  it("...should unpause when instructed.", async () => {
    const simpleBetInstance = await SimpleBet.deployed();

    // Unause contract
    await simpleBetInstance.unpause( { from: accounts[0] });

    // Check if unpaused
    const contractIsPaused = await simpleBetInstance.paused.call ();

    assert.isFalse(contractIsPaused, "The contract does not unpause.");
  });





});
