# final-project-colinmccrae
_This app was developed for submission as the final project for the ConsenSys Academy Developer Bootcamp 2019._

_Author: Colin McCrae. Email: colin.mccrae@gmail.com_


## Avoiding Common Atttacks - Used In This Project
The solidity contract within this app implements a number of measures to avoid common attacks, based on knowledge gained during the ConsenSys Academy Developer Bootcamp. These are described below.

### 1. Race Conditions: Reentrancy
Reentrancy is when a function is repeatedly called before first invocation is finished.

This attack vector has been mitigated in this app by the following:  
+ Remove external calls if possible.
+ Finish internal work before calling external functions. For example, set balance to zero / reduce balance before calling external function which otherwise could try to call the local function again repeatedly. This is known as the "Withdrawal Design Pattern". It separates the contract accounting logic and the transfer logic.
+ Use proven design patterns (e.g. withdrawal design pattern), and other battle tested design patterns. Learn from other people’s mistakes and heed their advice.
+ If multiple contract functions are called, check if cross function re-entrancy is possible)
+ Use pull over push payments
+ Mutual exclusion, or a mutex. This allows you to lock a state and only allow changes by the owner of the lock.

### 2. Race Conditions: Cross Function Reentrancy
This is similiar to above, but is when the reentrancy happens across functions. This was once of the exploits used in the DAO attack, and is maybe possible if contract has multiple functions that modify the same state.  

This attack vector has been mitigated in this app by the following:  
+ Where functions in the same contract share state, it has been considered what happens when multiple contract functions are called. 
+ As above, finish internal work before calling external functions, use proven design patterns, use pull over push payments, and consider mutual exclusion.

### 3. Transaction Ordering Dependence (TOD) / Front Running
Transactions that are broadcast to the network but have not yet been included in a block are in the mempool. This has two noteworth effects:
1. Miners choose the order in which to include transactions from the mempool into a block that they are mining.
2. Also, since transactions are in the mempool before they make it into a block, anyone can know what transactions are about to occur on the network. This can be problematic for things like decentralized markets. Protecting against this is difficult and likely needs contract specific solutions.

The general advice is:
+ Implement batch auctions
+ Use pre-commit scheme, where the details are submitted after the transaction is committed.

This attack vector has been mitigated in this app by the following:  
+ Only one bet allowed per block.
+ Maximum bet size restricted to well below the block reward.

### 4. Timestamp Dependence
Global block timestamp can be manipulated by miners within a small window. 

This attack vector has been mitigated in this app by the following:  
+ This app does not depend on block timestamp for any functionality 

### 5. Integer Overflow / Underflow
Maximum uint256 value is 2 ^ 256 - 1, after which it wraps around to 0. Underflow is a similar situation, except when a uint goes below its minimum value it is then set to its maximum value.

This attack vector has been mitigated in this app by the following:  
+ Considering if it's possible for any unit to get that large
+ Looking at how the variable is used to change the contract state
+ If a user can modify state it is more vulnerable. A variable that can be set by user input may need to check against overflow, whereas it is infeasible that a variable that is incremented will ever approach the unit256 maximum value.
+ Being careful with smaller data types like uint8, uint16, etc. as they can more easily reach their maximum value

### 6. Denial of Service: Unexpected Revert
Function becomes unusable. If the attacker has a contract which has a fallback that always reverts, the attacked contract’s function can becomes unusable - it will always revert. If a contract has a function that requires the transfer operation to succeed to fully execute, and the attacker's contract at the provided address throws an exception, execution halts and the exception is passed into the calling contract preventing further execution.

This attack vector has been mitigated in this app by the following:  
+ This situation is avoided by using the withdrawal design pattern

### 7. Denial of Service: Block Gas Limit
This can occur where a function is made to iterate over an array of undetermined length. This causes the transaction to exceed the block gas limit, and all transactions then revert.
If required:

The general advice is:
+ Use multiple blocks if necessary
+ Track payouts
+ Monitor gas use during development and testing

This attack vector has been mitigated in this app by the following:  
+ Never iterating over an array of undetermined length.

### 8. Force Send Ethere
Another danger is using logic that depends on the contract balance. Be aware that it is possible to send ether to a contract without triggering its fallback function. Using the selfdestruct function on another contract and using the target contract as the recipient will force the destroyed contract’s funds to be sent to the target. 

Ether can be forcibly sent to contracts in two main ways:
1. Attackers can send Ether to any address as the beneficiary of the `selfdestruct(address)` function, even if the fallback function is not payable
2. It can sometimes be possible to precompute a contract's deployed address and send ether to that address before the contract is deployed. The contract’s balance will then be greater than 0 when it is finally deployed which might affect logic if it relies on this fact.

This attack vector has been mitigated in this app by the following:  
+ An awareness of these conditions if using the contract balance in logic
+ Logic that depends on the contract balance is minimized. 

### 9 Call Depth Attack
Call depth attack: Possible to reach the 1024 call depth without depleting gas
+ Deprecated as of the EIP 150 hardfork, some attacks are no longer relevant
+ Keep up with latest smart contract developments

### 10. Poison Data
User input that breaks your smart contract functionality. For example, a user changing a state variable so it will overflow.
+ Assume users will input data that you don't expect, and that will break your smart contract if it can.
+ Sanitize / validate user input.
+ Use require() conditions to throw an exception if input is not valid.
+ Be aware of what your contract exposes to the world (default Solidty function accessability is 'public')
+ Be aware that all code and data on the blockchain is public, making them 'private' only makes them inaccessbile to other smart contracts directly. Private storage variables can still be read by observers of the blockchain.
+ Get code audited before production

### 11. Cross Chain Replay
After hard fork, there are two simlar blockchains running in parallel, eg. ETC forks from ETH after DAO hack. Transacations on ETC chain could be replayed on ETH main chain without consent of address owner. 
+ Keep in mind this is possible after a hard fork. 
+ Not an issue on one blockchain.

## Avoiding Common Atttacks - Not Used In This Project
There are a number of other measures to avoid common attacks that are not used in this contract. These are described below.
