# Documentation Generator
1. Ensure that `solidity-docgen` is installed to version **0.5.11**. If this project is cloned you can just run `npm i` to install dependencies.

2. Make sure that the `solc` is installed with alias `solc-0.8.6`.
```sh
npm i -D solc-0.8.6@npm:solc@0.8.6
```

3. Run the documentation script to generate the docs
```sh
npm run docify
```

1. Access the docs [here](SUMMARY.md)

## Editing Documentation Template
Edit the `contract.hbs` file in the `docgen/` folder to change the structure and generation of docs.