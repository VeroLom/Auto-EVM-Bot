import 'dotenv/config';
import { ethers } from 'ethers';
import chalk from "chalk";
import fs from "fs";
import path from "path";

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

// Load contracts
const buildDir = path.resolve("build");
let artifacts = [];
if (fs.existsSync(buildDir)) {
    artifacts = fs.readdirSync(buildDir)
        .filter(f => f.endsWith(".json"))
        .map(f => ({
            name: f.replace(".json", ""),
            ...JSON.parse(fs.readFileSync(path.join(buildDir, f), "utf8"))
        }));
    console.log(
        chalk.blueBright("[?] Loaded contracts:"),
        chalk.yellowBright(`${artifacts.length}`)
    );
} else {
    console.log(chalk.redBright("[!] No precompiled contracts found"));
}

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

function getRandomArtifact() {
    if (artifacts.length === 0) return null;
    return artifacts[Math.floor(Math.random() * artifacts.length)];
}

/*** Actions ***/
async function sendRandomValue() {
    const to = await getRandomAddressFromLastBlock();
    if (!to) {
        console.log(chalk.red('[-] No address found, skipping'));
        return;
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

async function deployRandomContract() {
    const artifact = getRandomArtifact();

    try {
        const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
        let contract;

        if (artifact.name === "MyToken") {
            contract = await factory.deploy(ethers.parseEther("1000"));
        } else {
            contract = await factory.deploy();
        }

        console.log(
            chalk.greenBright("[>] Deploying contract"),
            chalk.yellowBright(`${artifact.name}`),
            chalk.greenBright("...")
        );
        await contract.waitForDeployment();
        console.log(
            chalk.greenBright('[+] Contract deployed with address'),
            chalk.magenta(`${contract.target}`)
        );
    } catch (err) {

    }
}

async function executeAction() {
    await deployRandomContract();
    await sendRandomValue();
}

/*** Main ***/
async function loop() {
    await getBalance();
    await executeAction();

    // Loop
    const delay = loopDelay + (Math.random() * loopDelayOffset * 2 - loopDelayOffset);
    console.log(
        chalk.green('[?] Delay:'),
        chalk.magenta(`${delay / 1000}`)
    );

    setTimeout(async () => {
        await executeAction();
        loop();
    }, delay);
}

loop();