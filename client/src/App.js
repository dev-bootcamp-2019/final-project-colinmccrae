import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SimpleBet from "./contracts/SimpleBet.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
//  state = { storageValue: 0, web3: null, accounts: null, contract: null, currentBalance: null };
  state = { web3: null, accounts: null, contract: null, currentBalance: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      const currentBalance = balance / 10 ** 18;

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleBet.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleBet.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, currentBalance }, this.runExample);
    } 
    
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, balance, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  constructor (props) {
    super (props);

    console.log('binding addBankroll');
    this.addBankrollHere = this.addBankrollHere.bind (this);

  }  // End of constructor

  addBankrollHere () {
    const { accounts, contract } = this.state;

    contract.methods.addBankroll().send({ from: accounts[0], value: (5 * 10**18) });

    console.log ('Additional bankroll has been added.');

  }
  

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Give the deployed contract a 50 ether bankroll // Stores a given value, 5 by default.
    await contract.methods.addBankroll().send({ from: accounts[0], value: (50 * 10**18) });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
   // this.setState({ storageValue: response });
  };





  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, balance, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Simple Bet - An Ethereum Coin Flip Betting App</h1>
        <h2>(final-project-colinmccrae)</h2>
        <p>
          Author: Colin McCrae, colin.mccrae@gmail.com
        </p>
        <p>The coin flip app is installed and ready!</p>
        <p>
          <br></br>
        </p>

        <div>Your current Ethereum account address is: {this.state.accounts[0]}</div>
        <div>Your balance: {this.state.currentBalance} ETH</div>

        <br />
        <br />
        <button onClick={ this.addBankrollHere }> Start add 5 ETH to bankroll </button>
        <br />
        <br />

        <p>
          <br></br>
          <br></br>
          <br></br>
        </p>

        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: </div>



      </div>
    );
  }
}
//         <div>The stored value is: {this.state.storageValue}</div>

export default App;
