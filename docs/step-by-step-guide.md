# Bots Attack: Privacy w/ ZK Stack Demo

This guide walks you through the complete process of setting up the Bots Attack game on a private validium chain using ZK Stack and the Double Zero framework developed by Moonsong Labs and Matter Labs.

"Double Zero" is the name to refer to the collection of services that adds authentication and authorization on top of the newly created validium chain.
All the services are written in nodejs and they are meant to be easy to run and configure.

The "Bots Attack" game is a game very similar to the game "Battleship".
It's a two player turn-based game.
Each player places 5 "bots" on a 5x5 board, and have to guess the location of their opponent's bots.
The player to eliminate all 5 of their opponent's bots wins.

Let’s go step by step to run game.

## Deploy your validium chain

Our chain will be deployed using [zkstack](https://zkstack.io/). ZKstack enables you to create custom validium chains
tailored to your needs. For this guide, we'll use the basic deployment, but you can consult their documentation for more
customized configurations.

### Install System Dependencies

ZKstack relies on several system depenencies.
Follow [these instructions](https://github.com/matter-labs/zksync-era/blob/main/docs/src/guides/setup-dev.md) to get those set up.

### Install `zkstack`

Once the depenencies are installed, we can install `zkstack`. The easiest way to do this is installing `zkstackup` (a version manager
for zkstack) and then use that to install zkstack:

```sh
# Install zkstackup
curl -L https://raw.githubusercontent.com/matter-labs/zksync-era/main/zkstack_cli/zkstackup/install | bash

# Install zkstack
zkstackup
```

### Create a new ecosystem

Now that `zkstack` is installed we can use it to create our own validium chain.

Ensure to have to following ports free:

- 5432
- 8545

Now we need to create the ecosystem.
Move into a folder where you want to create the ecocsystem folder.
Then run the `ecosystem create` command below.

```sh
zkstack ecosystem create
```

Use the answers below to answer the prompts:

```txt
◇  What do you want to name the ecosystem?
│  local_elastic_network
│
◇  Select the origin of zksync-era repository
│  Clone for me (recommended) 
│
◇  Select the L1 network
│  Localhost 
│
◇  What do you want to name the chain?
│  my_game_chain
│
◇  What's the chain id?
│  54678
│
◇  Select how do you want to create the wallet
│  Localhost 
│
◇  Select the prover mode
│  NoProofs 
│
◇  Select the commit data generator mode
│  Validium 
│
◇  Select the base token to use
│  Eth 
│
◇  Enable EVM emulator?
│  No 
│
◇  Do you want to start containers after creating the ecosystem?
│  Yes 
```

Once everything is set, you can start your chain:

```sh
cd local_elastic_network

zkstack ecosystem init --dev

zkstack server run
```

Select `No DA` when prompted about the DA layer.

This is going to run all the local chain components and expose an open RPC at the port `3050`.

> Note: this RPC is open and permissionless!

### Start the contract verifier

The contract verifier is used to check contract source code against deployed byte-code. This is going to be used in the
explorer to display the source code and ABIs of contracts.

You are going to be prompted about the versions of compilers that you want to support. Please choose solc at least
0.8.24 and the latest versions of all other options. This is going to be used to verify contracts of our dapp.

In a new terminal run the following commands:

```sh
zkstack contract-verifier init

zkstack contract-verifier run
```

Once this is done you are going to have the verifier running in the port `3070`.

### Get some funds

At this stage you might want to send some local ETH to an address that you control. That can be done like this:

Open another terminal and run the following command:

```sh
npx zksync-cli \
  bridge \
  deposit --rpc=http://localhost:3050 \
  --l1-rpc=http://localhost:8545
```

This is going to open a wizard. One of the default rich private keys is
`0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110`, as the target you can use any address that you
control:

```sh
? Amount to deposit 111
? Private key of the sender 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
? Recipient address on L2 <your_address>
```

After this is done you are going to have funds ready to use in your local validium chain.

## Deploy the contracts

Now that we have some funds on our L2 chain, let's deploy the game contract.

First, clone this repository:

```sh
git clone https://github.com/sarahschwartz/double-zero.git
cd double-zero
```

Next, edit the `.env` file in the `bots_attack_game/contracts` folder with the private key of the wallet you just funded on your L2 chain:

```txt [bots_attack_game/contracts/.env]
WALLET_PRIVATE_KEY=0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
```

Next, move into the `bots_attack_game/contracts` folder to compile and deploy the game contract.

```sh
cd bots_attack_game/contracts
npm install
npm run compile
npm run deploy
```

You should see at the end an output like this:

```sh
Deploying BotsAttack contract to dockerizedNode
BotsAttack deployed to 0x111C3E89Ce80e62EE88318C2804920D4c96f92bb
```

Take note of the contract address.
This will be used in the next steps.

### Verifying the Contract

Finally, verify the contract by running the command below with your deployed contract address:

```sh
npx hardhat verify --network dockerizedNode <0xYOUR_CONTRACT_ADDRESS>
```

### Configure permissions

To configure the privacy permissions for the contract, let’s edit this file: `environments/compose-hyperchain-permissions.yaml`

This files defined the access for permissions for each contract.
The persmissions are already configured for the game contract,
so you just need to add the deployed contract address:

```sh
contracts:
  # Game contract
  - address: "<game_contract_address>" # <-- EDIT HERE
```

## Double Zero Services

At this stage we need to link the private chain with the double zero services. We are going to run the double zero services inside a Docker a network.
But they need to interact with our validium chain that is running in the host machine. The easiest way to make this work is by connecting the validium chain using your local ip.
You can use this commands to get your local ip:

```sh
# linux
ifconfig wlan0 | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'

# mac
ipconfig getifaddr en0

# windows
ipconfig
```

We are going to use your ip to link the validium rpc and the contract verifier.

Let’s go ahead end edit the file `double-zero/environments/compose-hyperchain.env`. You should make it look this:

```sh
TARGET_RPC="http://<your_ip>:3050"
CONTRACT_VERIFICATION_API_URL="http://<your_ip>:3070"

# Conf
CORS_ORIGIN_PROXY="http://localhost:3010"
CORS_ORIGIN_RPC="*"
# Secret to encript block explorer cookie. In production this has to
# be a secure value.
SESSION_SECRET="0101010101010101010101010101010101010101010101010101010101010101"
# Secret used to communicate between proxy and private rpc. This
# has to be a secure value in productioon.
CREATE_TOKEN_SECRET="sososecret"

# App
APP_API_URL=http://localhost:4040
APP_BRIDGE_URL=http://localhost:3000/bridge
APP_HOSTNAMES=localhost
APP_ICON=/images/icons/zksync-arrows.svg
APP_L2_CHAIN_ID=54678
APP_L2_NETWORK_NAME=Local Game Chain
APP_MAINTENANCE=false
APP_NAME=local
APP_PUBLISHED=true
APP_RPC_URL=http://localhost:4041
APP_BASE_TOKEN_ADDRESS=0x000000000000000000000000000000000000800A
```

Now you can run all the double zero services.

Run the command below from the root folder to start the services:

```sh
./environments/launch-hyperchain-env.sh
```

## Running the Game Frontend

Update the contract address in the `bots_attack_game/frontend/src/utils/constants.ts` file in the game frontend:

```ts [bots_attack_game/frontend/src/utils/constants.ts]
export const CONTRACT_ADDRESS = "<0xYOUR_CONTRACT_ADDRESS>";
```

Then, start the dapp frontend by running the commands below:

```sh
cd bots_attack_game/frontend
npm install
npm run dev
```

Now, you can go to [localhost:3000](http://localhost:3000) to see your dapp running.

### Connecting to the network

Before playing the game, go to the login page of the block explorer and follow the steps to add the custom network RPC: [localhost:3010/login](http://localhost:3010/login)

To simulate two players playing the game, open a 2nd browser with another Metamask wallet installed.
Follow the bridging step earlier to send funds to both "player" addresses.
The 2nd wallet must also go through the block explorer login page to connect to the network.

Finally, you can play the bots attack game against yourself at [localhost:3000](http://localhost:3000).

### Viewing the Transactions

Going to the block explorer, you should notice that all transactions you can view were sent by the connected wallet address.
Each player should only be able to see their own transactions.
