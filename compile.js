import fs from "fs";
import path from "path";
import solc from "solc";

const contractsDir = path.resolve("contracts");
const buildDir = path.resolve("build");

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

const sources = {};
fs.readdirSync(contractsDir).forEach(file => {
   if (file.endsWith(".sol")) {
       const filePath = path.resolve(contractsDir, file);
       sources[file] = { content: fs.readFileSync(filePath, "utf8") };
   }
});

const input = {
    language: "Solidity",
    sources,
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode"]
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach(err => console.error(err.formattedMessage));
}

for (const file in output.contracts) {
    for (const contractName in output.contracts[file]) {
        const contract = output.contracts[file][contractName];
        const artifact = {
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object
        };

        fs.writeFileSync(
            path.join(buildDir, `${contractName}.json`),
            JSON.stringify(artifact, null, 2)
        );

        console.log(`[v] Compiled ${contractName}`);
    }
}