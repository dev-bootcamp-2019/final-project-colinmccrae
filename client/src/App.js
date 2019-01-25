import React, { Component } from "react";
import SimpleBet from "./contracts/SimpleBet.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
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

    console.log('Binding enableBetting');
    this.enableBettingHere = this.enableBettingHere.bind (this);

    console.log('Binding disableBetting');
    this.disableBettingHere = this.disableBettingHere.bind (this);

    console.log('Binding addBankroll');
    this.addBankrollHere = this.addBankrollHere.bind (this);

    console.log('Binding removeBankroll');
    this.removeBankrollHere = this.removeBankrollHere.bind (this);
    
    console.log('Binding placeBet');
    this.placeBetHereHeads = this.placeBetHereHeads.bind (this);  

    console.log('Binding placeBet');
    this.placeBetHereTails = this.placeBetHereTails.bind (this);
    
    console.log('Binding resolveBet');
    this.resolveBetHere = this.resolveBetHere.bind (this);
    
  }  // End of constructor

  enableBettingHere () {
    console.log ('Enable betting function called.');
    const { accounts, contract } = this.state;

    contract.methods.enableBetting_only_Owner().send({ from: accounts[0] }, (err, result) => {
              if (err) {
                console.error ('An error occured:', err);
              }
              else {
                console.log ('Enable betting function successful.');
              }
            } );
  }

  disableBettingHere () {
    console.log ('Disable betting function called.');
    const { accounts, contract } = this.state;

    contract.methods.disableBetting_only_Owner().send({ from: accounts[0] }, (err, result) => {
      if (err) {
        console.error ('An error occured:', err);
      }
      else {
        console.log ('Disable betting function successful');
      }
    }  );
  }

  addBankrollHere () {
    console.log ('Additional bankroll function called.');
    const { accounts, contract } = this.state;

    contract.methods.addBankroll().send({ from: accounts[0], value: (5 * 10**18) }, (err, result) => {
      if (err) {
        console.error ('An error occured:', err);
      }
      else {
        console.log ('Additional bankroll function successful.');
      }
    }  );
  }
  
  removeBankrollHere () {
    console.log ('Bankroll withdrawal function called.');
    const { accounts, contract } = this.state;
    const howMuchToWithdraw = (5);

    contract.methods.withdrawBankroll(howMuchToWithdraw).send( { from: accounts[0] }, (err, result) => {
      if (err) {
        console.error ('An error occured:', err);
      }
      else {
        console.log ('Bankroll withdrawal function successful.');
      }
    }  );
  }

  placeBetHereHeads () {
    console.log ('1 ETH bet on Heads submitted for approval.');
    const { accounts, contract } = this.state;

    contract.methods.placeBet(true).send({ from: accounts[0], value: (1* 10**18) }, (err, result) => {
      if (err) {
        console.error ('An error occured:', err);
      }
      else {
        console.log ('1 ETH bet on Heads successfully placed.');
      }
    }  );
    this.forceUpdate()
  }

  placeBetHereTails () {
    console.log ('1 ETH bet on Tails submitted for approval.');
    const { accounts, contract } = this.state;

    contract.methods.placeBet(false).send({ from: accounts[0], value: (1* 10**18) }, (err, result) => {
      if (err) {
        console.error ('An error occured:', err);
      }
      else {
        console.log ('1 ETH bet on Tails successfully placed.');
      }
    }  );
  }

  resolveBetHere () {
    console.log ('Request to resolve and pay out last bet submitted for approval.');
    const { accounts, contract } = this.state;

    contract.methods.resolveBet(accounts[0]).send({ from: accounts[0] }, (err, result) => {
      if (err) {
        console.error ('An error occured:', err);
      }
      else {
        console.log ('Request to resolve and pay out last bet successful.');
      }
    }  );
  }

  // refreshValuesHere () {
  //   console.log ('Request to refresh.');
  //   const { accounts, contract } = this.state;

  //   contract.methods.resolveBet(accounts[0]).send({ from: accounts[0] }, (err, result) => {
  //     if (err) {
  //       console.error ('An error occured:', err);
  //     }
  //     else {
  //       console.log ('Refresh successful.');
  //     }
  //   }  );
  // }

  runExample = async () => {
//    const { accounts, contract } = this.state;

    // Give the deployed contract a 50 ether bankroll // Stores a given value, 5 by default.
//    await contract.methods.addBankroll().send({ from: accounts[0], value: (50 * 10**18) });

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
        <button onClick={ this.enableBettingHere }> Enable betting on contract </button>
        <button onClick={ this.disableBettingHere }> Disable betting on contract </button>
        <br />
        <br />
        <button onClick={ this.addBankrollHere }> Add 5 ETH to smart contract's bankroll </button>
        <button onClick={ this.removeBankrollHere }> Withdraw 5 wei from smart contract's bankroll </button>
        <br />
        <br />
        <button onClick={ this.placeBetHereHeads }> Bet 1 ETH on Heads </button>
        <button onClick={ this.placeBetHereTails }> Bet 1 ETH on Tails </button>
        <br />
        <button onClick={ this.resolveBetHere }> Resolve last bet </button>
        <br />
        <br />

        <br />
        <br />
        <p>
          <br></br>
          <br></br>
          <br></br>
        </p>


      </div>
    );
  }
}


// <button onClick={ this.refreshValues }> REFRESH VALUES </button>

//         <div>The stored value is: {this.state.storageValue}</div>

/* <p>
If your contracts compiled and migrated successfully, below will show
a stored value of 5 (by default).
</p>
<p>
Try changing the value stored on <strong>line 40</strong> of App.js.
</p>
<div>The stored value is: </div> */

export default App;
