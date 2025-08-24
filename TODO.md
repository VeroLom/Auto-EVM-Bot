# TODO

Task list for Auto-EVM-bot.

## Core Functionality

- [ ] Interact with public ecosystem contracts
- [ ] Support multiple EVM networks

## Improvements

- [ ] Organize output colors
- [ ] Add configurable transfer range
- [ ] Add logging to file
- [ ] Validate RPC and private key before execution
- [ ] Add CLI flags for dry-run and verbose mode
- [ ] Add run and compile commands to package.json

## Technical Debt

- [ ] Refactor main execution flow
- [ ] Separate config and logic layers
- [ ] Add unit tests for transfer logic

## Completed

- [x] Initial setup
- [x] Basic transfer logic
- [x] .env configuration
- [x] Random token transfers
- [x] Add periodic execution with randomized offset
- [x] Use recipient address from the latest block instead of generating a random one
- [x] Deploy random minimalist contracts
