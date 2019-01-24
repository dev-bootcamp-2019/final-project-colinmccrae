# final-project-colinmccrae
_This app was developed for submission as the final project for the ConsenSys Academy Developer Bootcamp 2019._

_Author: Colin McCrae. Email: colin.mccrae@gmail.com_


## Design Pattern Decisions - Patterns Used In This Project
The solidity contract within this app implements a number of design pattern decisions, based on knowledge gained during the ConsenSys Academy Developer Bootcamp. These are described below.

### 1. Withdrawal 
This design pattern is the recommended method of sending funds after an effect. Although the most intuitive method of sending Ether, as a result of an effect, is a direct transfer call, this is not recommended as it introduces a potential security risk. 

An attacker could trap a contract into an unusable state by causing the address for the withdrawal payout to be a contract that has a fallback function which fails (e.g. by using revert() or by just consuming more than the 2300 gas stipend transferred to them). That way, whenever transfer is called to deliver funds to the “poisoned” contract, it will fail and thus also becomeRichest will fail, with the contract being stuck forever.

In contrast, using the “withdraw” pattern used in this contract, the attacker can only cause his or her own withdraw to fail and not the rest of the contract’s workings.

### 2. Restricting Access
Restricting access is a common pattern for contracts, where you only allow external public access to select functions. Note that you can never restrict any human or computer from reading the content of transactions or the contract’s state. However, you can restrict read access to your contract’s state by other contracts. 

This is achieved initially by using the 'private' keyword when declaring functions.

Additionally, you can restrict who can make modifications to your contract’s state or call your contract’s functions. This is achieved in this contract through the use of function modifiers (to disable betting) and through the use of the OpenZeppelin library to all the simpleBet contract to inherit the contract Ownable which allows functions to be restricted to onlyOwner and which makes this restriction highly readable.

### 3. State Machine
Contracts often act as a state machine, which means that they have certain stages in which they behave differently or in which different functions can be called. A function call often ends a stage and transitions the contract into the next stage (especially if the contract models interaction). It is also common that some stages are automatically reached at a certain point in time.

In this contract there are two stages: waitingForBet and waitingForResolve. This is declared by the Status enum and used in the contract via the private instance of Status called playerStatus. Certain function, such as resolveBet cannot be called when the state is waitingForBet. Function modifiers have been used in this situation to model the states and guard against incorrect usage of the contract.

### 4. msg.sender Instead of tx.origin
This contract passes calls via msg.sonder rather than tx.origin. 

tx.origin is a security vulnerability. Using tx.origin makes you vulnerable to attacks comparable to phishing or cross-site scripting. Once a user has interacted with a malicious contract, that contract can then impersonate the user to any contract relying on tx.origin.

tx.origin breaks compatibility. Using tx.origin means that your contract cannot be used by another contract, because a contract can never be the tx.origin. This breaks the general composability of Ethereum contracts, and makes them less useful. In addition, this is another security vulnerability, because it makes security-based contracts like multisig wallets incompatible with your contract.

tx.origin is almost never useful - there are almost no legitimate uses for it.

## Design Pattern Decisions - Patterns Not Used In This Project
There are a number of other useful design patter decisions that are not used in this contract. These are described below.

### 5. Short Circuit Rules (to save gas)
The operators || and && apply the common short-circuiting rules. This means that in the expression f(x) || g(y), if f(x) evaluates to true, g(y) will not be evaluated even if it may have side-effects.

### 6. Gas Usage Optimization
There are many design patterns for optimizing gas usage:
+ Reduce the number of loops
+ Be careful not to loop over arrays of undeterimined length
+ Run tests for gas usage
+ Limit length of user supplied data
+ Use LLL for code that is called often

### 7. Fixed-size byte arrays
It is possible to use an array of bytes as `byte[]`, but it wastes a lot of space (31 bytes every element) when passing in calls. It is better to use `bytes`. As a rule of thumb, use bytes for arbitrary-length raw byte data and string for arbitrary-length string (UTF-8) data. If you can limit the length to a certain number of bytes, always use one of `bytes1` to `bytes32` because they are much cheaper.
