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

const minAmount = ethers.parseEther("0.00001");
const maxAmount = ethers.parseEther("0.00002");

/*** Functions ***/
function getRandomAddress() {
    return ethers.Wallet.createRandom().address;
}

async function sendRandomValue() {
    const to = getRandomAddress();
    const randomValue = Math.floor(Number(minAmount) + Math.random() * (Number(maxAmount) - Number(minAmount)));
    const value = ethers.getBigInt(randomValue.toString());

    try {
        const tx = await wallet.sendTransaction({ to, value });
        console.log(
            chalk.greenBright('[>] Transfer'),
            chalk.yellowBright(`${ethers.formatEther(value)}`),
            chalk.greenBright('PHRS to'),
            chalk.cyan(`${to}`)
        );
        console.log(
            chalk.greenBright('[?] TX:'),
            chalk.magenta(`${tx.hash}`)
        );

        await tx.wait();
    } catch (err) {
        console.log(chalk.red(`[!] Transfer error: ${err.message}`));
    }
}


/*** Main ***/
(async () => {
    const balance = await provider.getBalance(wallet.address);
    console.log(
        chalk.blueBright('[?] Wallet balance:'),
        chalk.yellowBright(`${ethers.formatEther(balance)}`),
        chalk.blueBright('PHRS'),
    )

    // Perform action
    await sendRandomValue();
})();