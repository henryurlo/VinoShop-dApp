# VinoShop-dApp
Simple online shopping cart using solidity, truffle, and boiler plates.

This project leverages the pet-shop-box as a the boiler plate and several example found online that I put together to get to this point.

Improvement Opportunity:
- I ran into several issues with Metamask when trying to execute a transaction at Checkout. So Checkout button not acting as it should.
- Empty Cart function is also throwing alerts. I will continue working on this.
- Keeping practicing reading from mapping, payable functions
- I will try to host the webapp with IPFS
## Dependencies
These are the dependencies need to run the webapp.

- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/

## Step 1. Clone the project
`git clone https://github.com/henryurlo/VinoShop-dApp`

## Step 2. Install dependencies
```
$ cd VinoShop-dApp
$ npm install
```
## Step 3. Start Ganache
Run the ganache client in current directory. This will start your local blockchain instance.
`ganache-cli`

## Step 4. Compile & Deploy VinoShop Smart Contract
`$ truffle compile`
`$ truffle migrate --reset`
You must migrate the smart contract each time your restart ganache.

## Step 5. Configure Metamask
- Unlock Metamask with the seed phrase and account should default to 0x0
- NOTE: Sometime Metamask throws an error when the tx number is not in sync with the eth account in use. To solve this you need to reset the Metamask account from the settings feature.

## Step 6. Run the Front End Application
`$ npm run dev`
Visit this URL in your browser: http://localhost:3000

Help  addressing the pending issues is greatly appreciate it.
