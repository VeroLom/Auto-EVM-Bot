# Auto-EVM-bot

Auto-EVM-bot is a minimalist bot that performs randomized token transfers on EVM-compatible networks.

## Features

- Sends a random amount of native tokens to a randomly generated address
- Periodic execution with randomized offset
- ~~Deploys random minimalist contracts~~
- ~~Interacts with public ecosystem contracts~~
- ~~Supports randomized execution intervals~~
- ~~Supports multiple networks~~

Currently, only token transfers are implemented. Other features are planned.

## Requirements

- Node.js >= 18
- `.env` file with:
    - `PRIVATE_KEY`: your wallet's private key
    - `RPC_URL`: RPC endpoint of the target EVM network

## Usage

1. Clone the repository
2. Install dependencies
3. Create a `.env` file with required variables
4. Run the bot

```bash
npm install
node index.js
