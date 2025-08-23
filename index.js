import 'dotenv/config';
import { ethers } from 'ethers';
import chalk from "chalk";

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

if (!privateKey || !rpcUrl) {
    console.log(chalk.red('[!] No private key or RPC URL found in .env'));
    process.exit(1);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

/*** Main ***/
(async () => {
    const balance = await provider.getBalance(wallet.address);
    console.log(
        chalk.blue('[?] Wallet balance:'),
        chalk.yellow(`${ethers.formatEther(balance)} PHRS`)
    )
})();