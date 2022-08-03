// https://forum.openzeppelin.com/t/incorporating-solidity-docgen-into-your-project/1882

const NODE_DIR     = "node_modules";
const INPUT_DIR    = "./contracts";
const CONFIG_DIR   = "./docs";
const OUTPUT_DIR   = "./docs/solidity-docs";
const README_FILE  = "./docs/README.md";
const SUMMARY_FILE = "./docs/SUMMARY.md";
const EXCLUDE_FILE = "./docs/exclude.txt";

const fs        = require("fs");
const path      = require("path");
const spawnSync = require("child_process").spawnSync;

// const excludeList  = lines(EXCLUDE_FILE).map(line => INPUT_DIR + "/" + line);
const excludeList = fs.readFileSync(EXCLUDE_FILE).toString().split("\n");
const relativePath = path.relative(path.dirname(SUMMARY_FILE), OUTPUT_DIR);
const DIAGRAM_DIR = path.relative(path.dirname(SUMMARY_FILE), "./docs/diagrams");

function lines(pathName) {
    return fs.readFileSync(pathName, {encoding: "utf8"}).split("\r").join("").split("\n");
}

function scan(pathName, indentation) {
    if (!excludeList.includes(pathName)) {
        if (fs.lstatSync(pathName).isDirectory()) {
            fs.appendFileSync(SUMMARY_FILE, indentation + "* " + path.basename(pathName) + "\n");
            for (const fileName of fs.readdirSync(pathName))
                scan(pathName + "/" + fileName, indentation + "  ");
        }
        else if (pathName.endsWith(".sol")) {
            const text = path.basename(pathName).slice(0, -4);
            const link = pathName.slice(INPUT_DIR.length, -4);
            fs.appendFileSync(SUMMARY_FILE, indentation + "* [" + text + "](" + relativePath + link + ".md)\n");
        }
    }
}

function fix(pathName) {
    if (fs.lstatSync(pathName).isDirectory()) {
        for (const fileName of fs.readdirSync(pathName))
            fix(pathName + "/" + fileName);
    }
    else if (pathName.endsWith(".md")) {
        fs.writeFileSync(pathName, lines(pathName).filter(line => line.trim().length > 0).join("\n\n") + "\n");
    }
}

fs.writeFileSync (SUMMARY_FILE, "# SITCOIN Project Docs\n");
fs.appendFileSync(SUMMARY_FILE, `
This page documents the solidity contract files used to create the backend system for the SIT Coin project that runs on the PlatON blockchain. There are three main components:
- SITCOIN Token Component
- NFT Market Component
- Digital Identity Component
`);
fs.appendFileSync(SUMMARY_FILE, `
## Documentation Generator
1. Ensure that \`solidity-docgen\` is installed to version **0.5.11**. If this project is cloned you can just run \`npm i\` to install dependencies.

2. Make sure that the \`solc\` is installed with alias \`solc-0.8.6\`.
\`\`\`sh
npm i -D solc-0.8.6@npm:solc@0.8.6
\`\`\`

3. Run the documentation script to generate the docs
\`\`\`sh
npm run docify
\`\`\`

## Editing Documentation Template
Edit the \`contract.hbs\` file in the \`docgen/\` folder to change the structure and generation of docs.
`);
// Add diagrams
fs.appendFileSync(SUMMARY_FILE, `
## UML Diagrams
`);
fs.appendFileSync(SUMMARY_FILE, `
### SITCOIN Token component:
![SITCOIN Token Component UML](${DIAGRAM_DIR}/sitcoin.png)
`);
fs.appendFileSync(SUMMARY_FILE, `
### NFT Market component:
![NFT Market Component UML](${DIAGRAM_DIR}/nft-market.png)
`);
fs.appendFileSync(SUMMARY_FILE, `
### Digital Identity component:
![Digital Identity Component UML](${DIAGRAM_DIR}/digital-identity.png)
`);
fs.appendFileSync(SUMMARY_FILE, `
## Contract Documentation Links

`);

// fs.writeFileSync (".gitbook.yaml", "root: ./\n");
// fs.appendFileSync(".gitbook.yaml", "structure:\n");
// fs.appendFileSync(".gitbook.yaml", "  readme: " + README_FILE + "\n");
// fs.appendFileSync(".gitbook.yaml", "  summary: " + SUMMARY_FILE + "\n");

scan(INPUT_DIR, "");

const args = [
    NODE_DIR + "/solidity-docgen/dist/cli.js",
    "--input="         + INPUT_DIR,
    "--output="        + OUTPUT_DIR,
    "--exclude="       + 'interfaces',
    "--templates="     + CONFIG_DIR,
    "--solc-module="   + 'solc-0.8.6' /*NODE_DIR + "/solc"*/,
    "--solc-settings=" + JSON.stringify({optimizer: {enabled: true, runs: 200}}),
    // "--contract-pages"
];

const result = spawnSync("node", args, {stdio: ["inherit", "inherit", "pipe"]});
if (result.stderr.length > 0)
    throw new Error(result.stderr.toString());

fix(OUTPUT_DIR);
