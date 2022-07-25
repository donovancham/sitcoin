// Imports
const { create } = require('ipfs-http-client')
const {
    owner,
    ownerhex,
    dev1,
    dev2,
    dev3,
    studentClaim,
    studentClaimHex,
    facultyClaim,
    facultyClaimHex
} = require('./walletAddress')
const { initWeb3, getContractAbi, getContractByteCode } = require('./web3Module')
require('dotenv').config()

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

// var ipfs

// // Main code
// try {
//     ipfs = create("http://localhost:5001")
// }
// catch (e) {
//     console.log(e)
// }

const web3 = initWeb3()

const claimHolderAbi = getContractAbi('ClaimHolder')
const claimHolderBytecode = getContractByteCode('ClaimHolder')
// const claimVerifierAbi = getContractAbi('ClaimVerifier')
// const claimVerifierBytecode = getContractByteCode('ClaimVerifier')

// const sitIdentityAddress = 'lat1t9s6tmx0pxkcq56juul27xmepd5cmeafw35hh5'
// const sitVerifierAddress = 'lat1rw6dun052lnv2yns8pkeqy5f6cenxa52pmmq3y'

const user = dev2

function recover(hash, sig, signer) {

}

const main = (async () => {

    var gas;

    console.log('Deploying User Identity...\n')

    // Create user identity
    const userIdentity = new web3.platon.Contract(claimHolderAbi, {
        from: user,
        gasPrice: '20000000000',
        gas: 100000000,
        data: claimHolderBytecode,
    })

    console.log('userID Contract:')
    console.log('from: ' + userIdentity.options.from)
    console.log('gas price (to use for tx): ' + userIdentity.options.gasPrice + 'von')
    console.log('Max gas limit: ' + userIdentity.options.gas + 'von\n')

    await userIdentity.deploy().estimateGas()
        .then((estimatedGas) => {
            console.log('Estimated gas: ' + estimatedGas + '\n')
            gas = estimatedGas * 2
        })
        .catch(console.error)

    // Deploy new contract
    await userIdentity.deploy().send({
        from: user,
        gas: gas,
    })
        .on('error', function (error) {
            console.log('ERRROR')
            console.log(error)
        })
        .on('transactionHash', function (transactionHash) {
            console.log('Transaction Hash:')
            console.log(transactionHash)
        })
        .on('receipt', function (receipt) {
            console.log('New Contract Address: ' + receipt.contractAddress) // contains the new contract address
            // console.log('Receipt:')
            // console.log(receipt)
        })
        .then(function (newContractInstance) {
            console.log(newContractInstance.options.address) // instance with the new contract address
        });

    // // Create user identity
    // const userIdentity = new web3.platon.Contract(claimHolderAbi, 'lat1hz9e8ud7tara2elmk3usrz9x3h6cdychq55mfc', { from: user })

    await userIdentity.methods.getKeysByPurpose(KEY_PURPOSES.MANAGEMENT).call({ from: user }, (error, result) => {
        error
            ? console.log('\nError occurred. ' + error)
            : console.log('\nKey: ' + result + '\n')
    })


    // // Initialize base SIT Identity
    // const sitIdentity = new web3.platon.Contract(claimHolderAbi, sitIdentityAddress, { from: owner })
    // // Initialize verifier contract
    // const sitVerifier = new web3.platon.Contract(claimVerifierAbi, sitVerifierAddress, { from: owner })

    // // Checks to ensure loaded
    // await sitIdentity.methods.getKeysByPurpose(KEY_PURPOSES.CLAIM).call({ from: owner }, (error, result) => {
    //     error
    //         ? console.log(error)
    //         : console.log('Key: ' + result + '\n')
    // })

    console.log('Deploying SIT Identity...' + '\n')

    const sitIdentity = new web3.platon.Contract(claimHolderAbi, {
        from: owner,
        gasPrice: '20000000000',
        gas: 100000000,
        data: claimHolderBytecode,
    })

    await sitIdentity.deploy().estimateGas()
        .then((estimatedGas) => {
            console.log('Estimated gas: ' + estimatedGas + '\n')
            gas = estimatedGas * 2
        })
        .catch(console.error)

    // Deploy new contract
    await sitIdentity.deploy().send({
        from: owner,
        gas: gas,
    })
        .on('error', function (error) {
            console.log('ERRROR')
            console.log(error)
        })
        .on('transactionHash', function (transactionHash) {
            console.log('Transaction Hash:')
            console.log(transactionHash)
        })
        .on('receipt', function (receipt) {
            console.log('New Contract Address: ' + receipt.contractAddress) // contains the new contract address
            // console.log('Receipt:')
            // console.log(receipt)
        })
        .then(function (newContractInstance) {
            console.log(newContractInstance.options.address) // instance with the new contract address
        });

    const sitIdentityAddress = sitIdentity.options.address

    // console.log(`Original keys:\n`)

    // await sitIdentity.methods.getKeysByPurpose(KEY_PURPOSES.CLAIM).call({ from: owner }, (error, result) => {
    //     error
    //         ? console.log('Error occurred. ' + error)
    //         : console.log('Key: ' + result + '\n')
    // })

    console.log('\nAdding SIT Claim Signer Key...' + '\n')

    // Creates a claim key for the owner
    const studentClaimKey = web3.utils.soliditySha3(studentClaimHex)
    console.log(`Hashed key: ${studentClaimKey}`)

    await sitIdentity.methods.addKey(
        studentClaimKey,
        KEY_PURPOSES.CLAIM,
        KEY_TYPES.ECDSA,
    ).estimateGas()
        .then((estimatedGas) => {
            console.log('Estimated gas: ' + estimatedGas + '\n')
            gas = estimatedGas * 2
        })
        .catch(console.error)

    await sitIdentity.methods.addKey(
        studentClaimKey,
        KEY_PURPOSES.CLAIM,
        KEY_TYPES.ECDSA,
    )
        .send({
            from: owner,
            gas: gas
        })
        .then((receipt) => {
            console.log(receipt)
        })
        .catch(console.error)

    // console.log('\nDeploying SIT Verifier...' + '\n')

    // const sitVerifier = new web3.platon.Contract(claimVerifierAbi, {
    //     from: owner,
    //     gasPrice: '20000000000',
    //     gas: 100000000,
    //     data: claimVerifierBytecode,
    // })

    // await sitVerifier.deploy({
    //     arguments: [sitIdentityAddress]
    // }).estimateGas()
    //     .then((estimatedGas) => {
    //         console.log('Estimated gas: ' + estimatedGas + '\n')
    //         gas = estimatedGas * 2
    //     })
    //     .catch(console.error)

    // // Deploy new contract
    // await sitVerifier.deploy({
    //     arguments: [sitIdentityAddress]
    // }).send({
    //     from: owner,
    //     gas: gas,
    // })
    //     .on('error', function (error) {
    //         console.log('ERRROR')
    //         console.log(error)
    //     })
    //     .on('transactionHash', function (transactionHash) {
    //         console.log('Transaction Hash:')
    //         console.log(transactionHash)
    //     })
    //     .on('receipt', function (receipt) {
    //         console.log('New Contract Address: ' + receipt.contractAddress) // contains the new contract address
    //         // console.log('Receipt:')
    //         // console.log(receipt)
    //     })
    //     .then(function (newContractInstance) {
    //         console.log(newContractInstance.options.address) // instance with the new contract address
    //     });

    // // Should show error
    // await sitIdentity.methods.getKeysByPurpose(KEY_PURPOSES.CLAIM).call({ from: user }, (error, result) => {
    //     error
    //         ? console.log('user has no permission to access contract methods (proof of self-sovereign identity)')
    //         : console.log('Key: ' + result)
    // })

    // Sign KYC Claim
    console.log('\nSelf-signing SIT claim...' + '\n')

    // Getting the claim key data from SIT Identity
    let tx = await sitIdentity.methods.getKey(studentClaimKey).call({ from: owner })

    // Delete unwanted data
    delete tx['0']
    delete tx['1']
    delete tx['2']

    console.log(JSON.stringify(tx))

    // Use current epoch time as salt for the signature
    // Add the hash of the Claim Key object from SIT Identity
    let meaningfulData = Date.now().toString() + web3.utils.soliditySha3(JSON.stringify(tx))

    // Use current epoch time as salt for the signature
    const dataHex = web3.utils.asciiToHex(meaningfulData)
    // This is the data to be signed
    const hashedData = web3.utils.soliditySha3(
        userIdentity.options.address,   // User Identity Address
        CLAIM_TYPES.SIT_STUDENT,
        dataHex
    )

    // Create signature from successful claim
    const signature = await web3.platon.personal.sign(hashedData, studentClaim, process.env.PW)

    console.log(`Signature: ${signature} (${signature.length})\n`)

    console.log('\nAdding new claim...')

    await userIdentity.methods.addClaim(
        CLAIM_TYPES.SIT_STUDENT,    // Type of claim
        CLAIM_SCHEMES.ECDSA,        // Encryption Scheme
        sitIdentityAddress,         // Issuer
        signature,                  // Signature of claim data
        dataHex,                    // Important string (Salt)
        '',                         // Link to IPFS
    ).estimateGas()
        .then((estimatedGas) => {
            console.log('Estimated gas: ' + estimatedGas + '\n')
            gas = estimatedGas * 2
        })
        .catch(console.error)

    var userClaim;

    await userIdentity.methods.addClaim(
        CLAIM_TYPES.SIT_STUDENT,    // Type of claim
        CLAIM_SCHEMES.ECDSA,        // Encryption Scheme
        sitIdentityAddress,         // Issuer
        signature,                  // Signature of claim data
        dataHex,                    // Important string (Salted)
        '',                         // Link to IPFS
    )
        .send({
            from: user,
            gas: gas
        })
        .then((receipt) => {
            console.log(receipt)
            console.log(JSON.stringify(receipt.events.ClaimAdded.returnValues))
            userClaim = receipt.events.ClaimAdded.returnValues
        })
        .catch(console.error)

    console.log('\nPre checks before validation...\n')

    // Ensure user identity has student claim
    console.log(`Student Claim Key: ${studentClaimKey}`)

    await sitIdentity.methods.keyHasPurpose(studentClaimKey, KEY_PURPOSES.CLAIM).call({ from: owner }, (error, result) => {
        error
            ? console.log(error)
            : console.log(`Key in Account: ${result}`)
    })

    // Check if able to get the claim from address and claim type
    const claimId = web3.utils.soliditySha3(sitIdentityAddress, web3.utils.toBN(CLAIM_TYPES.SIT_STUDENT))
    // const claimId = userClaim['claimId']
    console.log(`\nClaim ID: ${claimId}`)
    console.log(`Big number of '11': ${web3.utils.toBN(CLAIM_TYPES.SIT_STUDENT)}`)

    await userIdentity.methods.getClaim(claimId).call({ from: user }, (error, result) => {
        error
            ? console.log(error)
            : console.log(`Claim Key: \n${JSON.stringify(result)}\n`)
    })



    console.log('\nChecking claim is valid...\n')

    // Get the claim data from the user identity
    const claimData = await userIdentity.methods.getVerifyData(CLAIM_TYPES.SIT_STUDENT, sitIdentityAddress)
        .call({ from: owner })
        .catch(console.error)

    console.log(claimData)

    async function recover(userIdentityAddress, claimType, claimData, signer) {
        // Extract the hash and signature
        let data = claimData['data']
        let sig = claimData['signature']

        console.log(`Retrieved Data: ${data}\nRetrieved Sig: ${sig}\n`)

        let dataHash = web3.utils.soliditySha3(userIdentityAddress, claimType, data)

        // Use ecrecover to recover the sender address
        let recovered = await web3.platon.personal.ecRecover(dataHash, sig, { from: signer })

        console.log(`\nRecovered Address: ${recovered}`)

        return recovered
    }

    async function validate(identityAddress, recovered, contractOwner) {
        const trustedIdentity = new web3.platon.Contract(claimHolderAbi, identityAddress)

        // Get keyId of claim
        const keyId = web3.utils.soliditySha3(recovered)

        // Validate by ensuring claim is valid from trusted claim provider
        return await trustedIdentity.methods.keyHasPurpose(keyId, KEY_PURPOSES.CLAIM)
            .call({ from: contractOwner })
            .catch(console.error)
    }

    let r = await recover(userIdentity.options.address, CLAIM_TYPES.SIT_STUDENT, claimData, studentClaim)

    console.log('Validating...\n')

    await validate(sitIdentityAddress, r, owner)
        ? console.log('Success')
        : console.log('Fail')


    // await sitVerifier.methods.checkUser(
    //     userIdentity.options.address,
    //     CLAIM_TYPES.SIT_STUDENT
    // ).estimateGas()
    //     .then((estimatedGas) => {
    //         console.log('Estimated gas: ' + estimatedGas + '\n')
    //         gas = estimatedGas * 2
    //     })
    //     .catch(console.error)

    // // Verifier checks claim
    // await sitVerifier.methods.checkUser(
    //     userIdentity.options.address,
    //     CLAIM_TYPES.SIT_STUDENT
    // )
    //     .send({
    //         from: owner,
    //         gas: gas
    //     })
    //     .then((receipt) => {
    //         console.log(receipt)
    //     })
    //     .catch(console.error)
})

main()