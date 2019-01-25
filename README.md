# final-project-colinmccare
_This app was developed for submission as the final project for the ConsenSys Academy Developer Bootcamp 2019._

_Author: Colin McCrae. Email: colin.mccrae@gmail.com_


## Project Requirements
### Full Specs
[The final project specifications document can be found here](https://docs.google.com/document/d/1D45CGqge6De-i-8X6IkIhzNHb9UYWA79Zb30sZsfBoQ/edit "ConsenSys Academy Developer Program - Final Project Specs")

### README.md Requirements (this file)
The requirements for this file are as below:

> Project includes a README.md that explains the project.
> 
> (5 points) - The README should include a description of what the app does and how to set it up for evaluation.

### Repo Location
[The final project is stored here on Github](https://github.com/dev-bootcamp-2019/final-project-colinmccrae "Github - Final Project: colinmccrae")

## App Description
This app is a very simple betting app, based around a coin flip (heads or tails).

The user can select how much they would like to bet, and whether they think the result will be heads or tails.

The information for the bet is saved on a block on the blockchain.

In a future block, the same user can come back and evaluate their bet to see if they won. The result is randomly generated based on the hash of the block in which the user requests their bet is evaluated.

If the bet wins, an event is triggered, and the user received twice the value of his or her bet back. If the bet loses, only an event is triggered.

## How to Set Up for Evaluation
### Pre-requisites
 It is presumed that the evaluator has the following applications already installed:
+ Git
+ NPM (Node Package Manager)
+ Truffle
+ Ganache (or Ganache-CLI)
+ Google Chrome with Metamask Plug-in installed
+ A code editor (e.g. VS Code or Atom)

### Steps
The following steps will allow the project to be evaluated. The terminal commands are based on using Ubuntu Linux 18.04 (or 18.10).

1. Navigate your development folder and clone the project repo from Github. The command below will create a folder 'final-project-colinmccrae' in your chosen development folder. 

   $ `git clone https://github.com/dev-bootcamp-2019/final-project-colinmccrae`

2. Go into the new folder 

   $ `cd final-project-colinmccrae`

3. Install the npm modules

   $ `npm install`

4. To view in a code editor 

   $ `code .` for VS Code or `atom .` for Atom

5. To compile the app code

   $ `truffle compile`

6. Ensure that you are running Ganache (or Ganache-CLI) on Port 7545 (HTTP://127.0.0.1:7545)

7. Ensure the Metamask Chrome Plug-in is connected to your Ganache (or Ganache-CLI) instance. The requires the same twelve-word seed phrase to be used for both.

8. To migrate the contacts to the Ganache local blockchain

   $ `truffle migrate` (if you need to migrate the contract again, you will  need to use `truffle migrate --reset`)

9. To run the app code tests

   $ `truffle test`

10. Run the app's JavaScript React development server locally to bring up the app UI. These commands should automoatically open your default browser (you'll need Google Chrome with Metamask Plug-in installed) and bring up the app at the local address (URL = http://localhost:3000/) where you can interact with the app. Note that it will prompt you to sign into Metamask if you are not already signed in. 

   $ `cd client`

   $ `nmp install`
   
   $ `npm run start`

11. You should now be able to use the app's UI. When approving a transaction in Metamask, if you get a nonce mismatch error that is due to Metamask being out of sync with Ganache and you will need to reset both.

Please press Ctrl + Shift + I and view the developer console in Google Chrome. All the contract actions will appear there as console log entries.

There is a bug with the withdrawl from contract for large withdrawls, so it has been set to 5 wei for now.

12. Ctrl+C to exit the development server in Terminal.
