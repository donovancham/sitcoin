const ClaimHolder = artifacts.require("ClaimHolder")
const { owner, ownerhex, dev2, dev2hex, studentClaim, studentClaimHex, facultyClaim, facultyClaimHex } = require("../scripts/walletAddress")
const truffleAssert = require('truffle-assertions');
const { initWeb3, getContractAbi, getContractByteCode } = require('../scripts/web3Module');
const { assert } = require("chai");
require('dotenv').config();

contract("ClaimHolder", () => {
    // Initializes web3 context for interaction with contract
    const web3 = initWeb3()
    // Initialize contract ABI and BYTECODE
    const claimHolderAbi = getContractAbi('ClaimHolder')
    const claimHolderBytecode = getContractByteCode('ClaimHolder')

    // Set user
    const user = dev2
    const userhex = dev2hex
    const userKey = web3.utils.soliditySha3(userhex)
    const ownerKey = web3.utils.soliditySha3(ownerhex)
    const addressZero = '0x0000000000000000000000000000000000000000'

    // Set the claim ID because unable to convert from 'lat1z...' format to hex format
    var CLAIM_ID
    var ISSUER
    var SIGNATURE
    var DATA

    // Set constants for claim keys for SIT identity
    const studentClaimKey = web3.utils.soliditySha3(studentClaimHex)
    const facultyClaimKey = web3.utils.soliditySha3(facultyClaimHex)

    // Define constant identifiers used in pusposes and other types
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

    // Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
    beforeEach(async () => {
        // New instance every test
        this.sitIdentity = await ClaimHolder.deployed()
    })

    // Test contract deployment
    // Test getKeysByPurpose()
    it("should be able to deploy new identity from web3", async () => {
        // Deploy new contract
        this.userIdentity = await ClaimHolder.new({ from: user })

        // Test getting keys function
        const key = await this.userIdentity.getKeysByPurpose(KEY_PURPOSES.MANAGEMENT, { from: user })

        // Test to ensure able to get key from account
        assert.equal(userKey, key[0], 'Missing Management Key')
    })

    // Test sit identity deployed with claims configured correctly
    // Test getKey()
    // Test getKeyPurpose()
    it("should be able to get deployed keys from sit identity (ensure deployed correctly)", async () => {
        const key1 = await this.sitIdentity.getKey(studentClaimKey, { from: owner })
        assert.equal(key1.purpose, KEY_PURPOSES.CLAIM, "Student Claim Purpose Wrong")
        assert.equal(key1.keyType, KEY_TYPES.ECDSA, "Student Claim type Wrong")
        assert.equal(key1.key, studentClaimKey, "Student Claim key ID Wrong")
        const purpose = await this.sitIdentity.getKeyPurpose(facultyClaimKey, { from: owner })
        assert.equal(purpose, KEY_PURPOSES.CLAIM, "Faculty Claim Purpose Wrong")
    })

    // Test addKey()
    it("should be able to add new key", async () => {
        const tx = await this.userIdentity.addKey(
            ownerKey,
            KEY_PURPOSES.CLAIM,
            KEY_TYPES.ECDSA,
            { from: user }
        )

        // Ensure that key is added
        truffleAssert.eventEmitted(tx, 'KeyAdded', (ev) => {
            return ev.key == ownerKey && ev.purpose == KEY_PURPOSES.CLAIM && ev.keyType == KEY_TYPES.ECDSA
        })
    })

    // Test removeKey()
    it("should be able to remove key", async () => {
        const tx = await this.userIdentity.removeKey(ownerKey, { from: user })

        // Ensure that key is removed
        truffleAssert.eventEmitted(tx, 'KeyRemoved', (ev) => {
            return ev.key == ownerKey && ev.purpose == KEY_PURPOSES.CLAIM && ev.keyType == KEY_TYPES.ECDSA
        })
    })

    // Test addClaim()
    it("should add a signed student claim", async () => {
        // Get SIT student claim key
        const signerkey = await this.sitIdentity.getKey(studentClaimKey, { from: owner })
        // Clean data
        delete signerkey['0']
        delete signerkey['1']
        delete signerkey['2']

        // Create obfuscated data to be signed
        const data = Date.now().toString() + web3.utils.soliditySha3(JSON.stringify(signerkey))
        const dataHex = web3.utils.asciiToHex(data)

        DATA = dataHex

        const hashedData = web3.utils.soliditySha3(
            this.userIdentity.address,
            CLAIM_TYPES.SIT_STUDENT,
            dataHex
        )

        // Create signature
        const signature = await web3.platon.personal.sign(
            hashedData,
            studentClaim,
            process.env.STUDENT_CLAIM_PW
        )

        SIGNATURE = signature

        // Add new claim
        const tx = await this.userIdentity.addClaim(
            CLAIM_TYPES.SIT_STUDENT,
            CLAIM_SCHEMES.ECDSA,
            this.sitIdentity.address,
            signature,
            dataHex,
            '',
            { from: user },
        )

        // Assert ClaimAdded event fired
        truffleAssert.eventEmitted(tx, 'ClaimAdded', async (ev) => {
            CLAIM_ID = ev.claimId
            ISSUER = ev.issuer

            return ev.topic == CLAIM_TYPES.SIT_STUDENT &&
                ev.scheme == CLAIM_SCHEMES.ECDSA &&
                web3.utils.toBech32Address('lat', ev.issuer) == this.sitIdentity.address &&
                ev.signature == signature &&
                ev.data == dataHex &&
                ev.uri == ''
        })
    })

    // Test getClaim()
    it("should be able to get claim data", async () => {
        // Should be able to get claim data
        const claim = await this.userIdentity.getClaim(
            CLAIM_ID,
            { from: user }
        )

        assert.equal(claim.topic, CLAIM_TYPES.SIT_STUDENT, "Claim type should be student")
        assert.equal(claim.scheme, CLAIM_SCHEMES.ECDSA, "Scheme type should be ECDSA")
        assert.equal(web3.utils.toBech32Address('lat', claim.issuer), this.sitIdentity.address, "Issuer incorrect")
        assert.equal(claim.signature, SIGNATURE, "Signature incorrect")
        assert.equal(claim.data, DATA, "Data incorrect")
        assert.equal(claim.uri, '', "URI should be empty")
    })

    // Test getVerifyData()
    it("should be able to verify claim", async () => {
        // Get data used to verify claim
        const verifyData = await this.userIdentity.getVerifyData(CLAIM_TYPES.SIT_STUDENT, this.sitIdentity.address, { from: user })

        // Extract signature and data from result
        const data = verifyData['data']
        const sig = verifyData['signature']

        // Perform hashing function
        const hashedData = web3.utils.soliditySha3(
            this.userIdentity.address,
            CLAIM_TYPES.SIT_STUDENT,
            data
        )

        // Recovered address
        const recovered = await web3.platon.personal.ecRecover(hashedData, sig, { from: studentClaim })

        // Ensure that recovered address is same as signer address
        assert.equal(recovered, studentClaimHex, "Recovered address not same as signer key")

        // Get Key ID for trusted issuer's signer key
        const recoveredKeyId = web3.utils.soliditySha3(recovered)

        const verifyResult = await this.sitIdentity.keyHasPurpose(
            recoveredKeyId,
            KEY_PURPOSES.CLAIM,
            { from: owner }
        )

        assert.equal(verifyResult, true, "Verify failed")
    })

    // Test removeClaim()
    it("should be able to remove claim", async () => {
        const tx = await this.userIdentity.removeClaim(CLAIM_ID, { from: user })

        // Assert ClaimRemoved event fired
        truffleAssert.eventEmitted(tx, 'ClaimRemoved', async (ev) => {
            return ev.claimId == CLAIM_ID &&
                ev.topic == CLAIM_TYPES.SIT_STUDENT &&
                ev.scheme == CLAIM_SCHEMES.ECDSA &&
                web3.utils.toBech32Address('lat', ev.issuer) == this.sitIdentity.address
        })
    })
})