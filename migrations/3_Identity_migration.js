// Migrations for ClaimHolder identity and ClaimVerifier contract

const { owner, ownerhex, studentClaimHex, facultyClaimHex } = require("../scripts/walletAddress");
const ClaimHolder = artifacts.require("ClaimHolder");
const { initWeb3, getContractAbi } = require("../scripts/web3Module");

const KEY_PURPOSES = {
    "MANAGEMENT": 1,
    "CLAIM": 3
}

const KEY_TYPES = {
    "ECDSA": 1
}

const CLAIM_SCHEMES = {
    "ECDSA": 1
}

const CLAIM_TYPES = {
    "SIT_STUDENT": 11,
    "SIT_FACULTY": 12,
}

module.exports = (deployer) => {
    const web3 = initWeb3()

    // Deploy using SIT's signer identity
    deployer.deploy(ClaimHolder, {from: owner})
    .then( async () => {
        // Loads the contract instance to get the deployed address
        const sitIdentity = await ClaimHolder.deployed()

        // Initializes the contract for calling
        const claimContract = new web3.platon.Contract(getContractAbi('ClaimHolder'), sitIdentity.address)
        // Creates a claim key for student claims
        const studentClaimKey = web3.utils.keccak256(studentClaimHex)
        
        // Used for signing claims for identities after they have undergone KYC
        await claimContract.methods.addKey(
            studentClaimKey,
            KEY_PURPOSES.CLAIM,
            KEY_TYPES.ECDSA,
        ).send({ from: owner })

        // Creates a claim key for faculty claims 
        const facultyClaimKey = web3.utils.keccak256(facultyClaimHex)
        
        // Used for signing claims for identities after they have undergone KYC
        await claimContract.methods.addKey(
            facultyClaimKey,
            KEY_PURPOSES.CLAIM,
            KEY_TYPES.ECDSA,
        ).send({ from: owner })
    })
};