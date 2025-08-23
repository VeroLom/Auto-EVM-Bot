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

const minAmount = ethers.parseEther("0.000001");
const maxAmount = ethers.parseEther("0.000002");
const loopDelay = 30000;
const loopDelayOffset = 5000;

/*** Functions ***/
async function getRandomAddressFromLastBlock() {
    try {
        const block = await provider.getBlock("latest");
        if (!block || !block.transactions || block.transactions.length === 0) {
            console.log(chalk.redBright(`[!] Block or transactions not found`));
            return null;
        }

        for (const txHash of block.transactions) {
            try {
                const tx = await provider.getTransaction(txHash);
                if (tx && tx.from) {
                    return tx.from;
                }
            } catch (innerErr) {
                console.log(chalk.redBright(`[!] Error getting transaction ${innerErr.message}`));
            }
        }

        return null;
    } catch (err) {
        console.log(chalk.redBright(`[!] Error getting an address from the last block: ${err.message}`));
        return null;
    }
}

/*** Actions ***/
async function sendRandomValue() {
    const to = await getRandomAddressFromLastBlock();
    if (!to) {
        console.log(chalk.red('[-] No address found, skipping'));
    }

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

async function getBalance() {
    const balance = await provider.getBalance(wallet.address);
    console.log(
        chalk.blueBright('[?] Wallet balance:'),
        chalk.yellowBright(`${ethers.formatEther(balance)}`),
        chalk.blueBright('PHRS'),
    )
}

/*** Main ***/
async function loop() {
    await getBalance();

    // Loop
    const delay = loopDelay + (Math.random() * loopDelayOffset * 2 - loopDelayOffset);
    console.log(
        chalk.green('[?] Delay:'),
        chalk.magenta(`${delay / 1000}`)
    );

    setTimeout(async () => {
        await sendRandomValue();
        loop();
    }, delay);
}

loop();