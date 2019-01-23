var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SimpleBet = artifacts.require("./SimpleBet.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SimpleBet);
};
