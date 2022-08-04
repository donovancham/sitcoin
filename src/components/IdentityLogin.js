import { useState, useEffect } from 'react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table'
import DOMPurify from 'isomorphic-dompurify';
import { Report } from 'notiflix/build/notiflix-report-aio';

import Web3 from 'web3';
import { connectSamurai, useWalletContext } from '../context/WalletContext';

import claimHolder from '../../build/contracts/ClaimHolder.json'

/**
 * @fileOverview The Login component
 * @author Donovan Cham
 * 
 * @example
 * import IdentityLogin from './components/IdentityLogin';
 * 
 * export default function Homepage {
 *   return <IdentityLogin />
 * }
 */

/**
 * Component for Identity Login page. Renders a form used for processing 
 * logins and provides an interface with buttons for the intermediary 
 * steps required before the login process can be executed. 
 * 
 * @module IdentityLogin
 * @see {@link module:NextAuth|NextAuth}
 * 
 * @todo Fix the error when deploying an identity from the web3 dApp
 * @todo Implement the KYC process that the user has to undergo to verify identity
 * @todo Do the function to create a signed student claim
 * @todo Implement the login function
 * @todo Implement the verify claim function for the login process
 * @todo Call the `SignIn` feature to authenticate the user
 */


export default function IdentityLogin({ csrfToken }) {
    /**
     * Constants for Key Purpose Identifiers
     * @const {JSON} KEY_PURPOSES
     * @property {Number} MANAGEMENT The identifier for MANAGEMENT Keys
     * @property {Number} CLAIM The identifier for CLAIM Keys
     */
    const KEY_PURPOSES = {
        "MANAGEMENT": 1,
        "CLAIM": 3
    }

    /**
     * Constants for the Key Encryption schemes.
     * 
     * @const {JSON} KEY_TYPES
     * @property {Number} ECDSA ECDSA Encryption scheme
     */
    const KEY_TYPES = {
        "ECDSA": 1
    }

    /**
     * Constants for the Claim Encryption schemes.
     * 
     * @const {JSON} CLAIM_SCHEMES
     * @property {Number} ECDSA ECDSA Encryption scheme
     */
    const CLAIM_SCHEMES = {
        "ECDSA": 1
    }

    /**
     * Constants for Claim Type Identifiers.
     * 
     * @const {JSON} CLAIM_TYPES
     * @property {Number} SIT_STUDENT Student Claim topic ID
     * @property {Number} SIT_FACULTY Faculty Claim topic ID
     */
    const CLAIM_TYPES = {
        "SIT_STUDENT": 11,
        "SIT_FACULTY": 12,
    }

    /**
     * Constants for checking if account is connected. The `refresh` 
     * state is used to create an event hook to reload the identity 
     * information when the state is changed.
     * 
     * @see {@link module:WalletProvider|WalletContext}
     * 
     * @const {Object} WalletContextState
     * @property {String} account - Contains the account that is 
     * connected from the user's wallet
     * @property {Dispatch<SetStateAction<String>>} setAccount - The 
     * setter function for the account state variable
     * @property {Number} refresh - The refresh state counter
     * @property {Object} web3 - The web3 instance
     */
    const { account, setAccount, refresh, web3 } = useWalletContext()

    /**
     * The server state variable that stores the server's web3 instance 
     * for interacting with web3 elements. This should be separate from 
     * the instance loaded by the user since it needs access to the SIT 
     * claim signer accounts to sign claims.
     * 
     * @const {Object} ServerWeb3State 
     * @property {Object} serverWeb3 Stores the server's web3 instance
     * @property {Dispatch<SetStateAction<Object>>} setServerWeb3 Sets the 
     * web3 instance
     */
    const [serverWeb3, setServerWeb3] = useState()

    /**
     * Indicates if form is validated.
     * 
     * @const {Object} ValidatedState 
     * @property {Boolean} validated Stores the `validated` flag
     * @property {Dispatch<SetStateAction<Boolean>>} setValidated Sets 
     * the `validated` flag
     */
    const [validated, setValidated] = useState(false)

    /**
     * Indicates if the `address` field in the form is validated.
     * 
     * @const {Object} AddressValidatedState 
     * @property {Boolean} addressValidated Stores the `addressValidated` flag
     * @property {Dispatch<SetStateAction<Boolean>>} setAddressValidated 
     * Sets the `addressValidated` flag
     */
    const [addressValidated, setAddressValidated] = useState(false)

    /**
     * Indicates if the `identity` field in the form is validated.
     * 
     * @const {Object} IdentityValidatedState 
     * @property {Boolean} identityValidated Stores the `identityValidated` flag
     * @property {Dispatch<SetStateAction<Boolean>>} setIdentityValidated 
     * Sets the `identityValidated` flag
     */
    const [identityValidated, setIdentityValidated] = useState(false)

    /**
     * Holds the user's identity contract instance that is loaded when 
     * the contract address is provided.
     * 
     * @const {Object} IdentityContractState 
     * @property {Object} identityContract Stores the contract instance 
     * of the user's loaded identity
     * @property {Dispatch<SetStateAction<Object>>} setIdentityContract 
     * Sets the contract instance
     */
    const [identityContract, setIdentityContract] = useState()

    /**
     * Holds the user's identity contract address.
     * 
     * @const {Object} IdentityAddressState 
     * @property {String} identityAddress Stores the contract address.
     * @property {Dispatch<SetStateAction<String>>} setIdentityAddress 
     * Sets the contract address
     */
    const [identityAddress, setIdentityAddress] = useState()

    /**
     * Holds the user identity contract's Keys after getting them from 
     * the contract.
     * 
     * @const {Object} IdentityKeysState 
     * @property {Array<Object>} identityKeys Stores the Key objects
     * @property {Dispatch<SetStateAction<String>>} setIdentityKeys 
     * Sets the Key object
     */
    const [identityKeys, setIdentityKeys] = useState()

    /**
     * Holds the user identity contract's Claims after getting them from 
     * the contract.
     * 
     * @const {Object} IdentityClaimsState 
     * @property {Array<Object>} identityClaims Stores the Claim objects
     * @property {Dispatch<SetStateAction<String>>} setIdentityClaims 
     * Sets the Claim object
     */
    const [identityClaims, setIdentityClaims] = useState()

    // Runs when the component is loaded.
    useEffect(() => {
        const init = async () => {
            // Load wallet settings
            if (account === undefined) {
                console.log(account)
                // Sets wallet account
                setAccount(await connectSamurai(web3))

                // Init server web3 instance
                setServerWeb3(new Web3(process.env.NEXT_PUBLIC_DEVNET_RPC))
            }
        }

        init()
    })

    // Runs when the component is loaded.
    // Hook detects changes to the `identityContract` instance and `refresh` 
    // instance to reload state variables.
    useEffect(() => {
        /**
         * Loads the identity contract details.
         * @async
         * @function getDetails
         */
        const getDetails = async () => {
            await getKeys();
            await getClaims();
        }

        // Ensure that `identityContract` instance is loaded before 
        // getting contract details
        if (identityContract !== undefined) {
            getDetails();
            console.log(identityKeys)
            console.log(identityClaims)
        }

    }, [identityContract, refresh])

    /**
     * Checks if this identity address is a valid, deployed contract.
     * @async
     * @function checkIdentity
     * @param {String} address The address of the identity contract
     * @returns {Boolean} True if identity is valid
     */
    async function checkIdentity(address) {
        // Initialize identity contract
        let contract = await new web3.platon.Contract(claimHolder.abi, address)

        // Check to ensure that identity contract can be interacted with
        await contract.methods.getKeysByPurpose(KEY_PURPOSES.MANAGEMENT)
            .call({ from: account })
            .then((receipt) => {
                console.log(receipt)

                // Since successful validation, set the identity contract object
                setIdentityContract(contract)

                // Set the identity contract address
                setIdentityAddress(address)

                // Lock in the value for the form
                let addressInput = document.getElementById("identityAddress")
                addressInput.setAttribute('disabled', true)
                addressInput.setAttribute('readonly', true)

                Report.success(
                    'Identity Valid',
                    `Identity is valid. You may proceed to get a Claim or verify existing Claims.`,
                    'Okay'
                )

                return true
            })
            .catch((error) => {
                console.log(error)
                Report.failure(
                    'Error',
                    `Invalid contract address. Please create identity before proceeding.`,
                    'Okay'
                )
                return false
            })
    }

    /**
     * @todo Do the function to create a signed student claim
     */
    async function createStudentClaim() {

    }

    /**
     * @todo Fix the error when deploying an identity from the web3 dApp
     * 
     * Deploys a new identity contract for users who do not have an 
     * existing identity contract. 
     * 
     * @async
     * @function createIdentity
     */
    async function createIdentity() {
        let contract = await new web3.platon.Contract(claimHolder.abi)

        await contract.deploy({ data: claimHolder.bytecode, arguments: [] }).estimateGas({ from: account })
            .then(async (gasAmount) => {
                console.log(`Estimated gas = ${gasAmount} (${Math.floor(gasAmount * 1.1)})`)
                await contract.deploy({ data: claimHolder.bytecode, arguments: [] })
                    .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                    .then(async (receipt) => {
                        // Identity successfully deployed
                        console.log(receipt)
                        console.log(`New contract address: ${receipt.contractAddress}`)

                        // Set the new contract address
                        setIdentityAddress(receipt.contractAddress)

                        // Create a new identity object
                        newIdentity = await new web3.platon.Contract(claimHolder.abi, receipt.contractAddress)
                        setIdentityContract(newIdentity)

                        // Lock in the value for the form
                        addressInput = document.getElementById("identityAddress")
                        addressInput.setAttribute('value', receipt.contractAddress)
                        addressInput.setAttribute('readonly', true)

                        Report.success(
                            'Identity Created',
                            `Your Identity address <strong>${receipt.contractAddress}</strong>`,
                            'Okay'
                        )
                    })
                    .catch((error) => {
                        console.log(error)
                        Report.failure(
                            'Error',
                            `${error.message} (${error.code})`,
                            'Okay'
                        )
                    })
            })
            .catch((error) => {
                console.log(error)
                Report.failure(
                    'Error',
                    `${error.message} (${error.code})`,
                    'Okay'
                )
            })
    }

    /**
     * Checks if the address passed in is a valid 
     * {@link https://devdocs.platon.network/docs/en/JS_SDK#web3utilsisbech32address|PlatON Bech32} 
     * address.
     * 
     * @function validateAddress
     * @param {String} address The identity contract address
     * @returns {Boolean} True if address is valid
     */
    function validateAddress(address) {
        // Check if address is valid
        return web3.utils.isBech32Address(address)
    }

    /**
     * Ensure that all form validation checks are `true`.
     * 
     * @function checkValid
     * @returns {Boolean} True if all fields valid
     */
    function checkValid() {
        return addressValidated && identityValidated
    }

    /**
     * Gets all keys that the identity contract has. All keys will be 
     * passed into an object and loaded to the `identityKeys` state.
     * 
     * @see {@link module:IdentityLogin~IdentityKeysState|IdentityKeysState}
     * @async
     * @function getKeys
     */
    async function getKeys() {
        let keyIDs = []
        let keys = []

        // Checks for the keys with purpose 1 (MANAGEMENT)
        await identityContract.methods.getKeysByPurpose(KEY_PURPOSES.MANAGEMENT)
            .call({ from: account })
            .then((receipt) => {
                console.log(receipt)
                receipt.map((key) => {
                    keyIDs.push(key)
                })
            })
            .catch((error) => {
                console.log(error)
                Report.failure(
                    'Error',
                    `${error.message} (${error.code})`,
                    'Okay'
                )
            })

        // Checks for the keys with purpose 3 (CLAIM)
        await identityContract.methods.getKeysByPurpose(KEY_PURPOSES.CLAIM)
            .call({ from: account })
            .then((receipt) => {
                console.log(receipt)
                receipt.map((key) => {
                    keyIDs.push(key)
                })
            })
            .catch((error) => {
                console.log(error)
                Report.failure(
                    'Error',
                    `${error.message} (${error.code})`,
                    'Okay'
                )
            })

        // Makes a call to get each individual key
        keyIDs.map(async (keyId) => {
            await identityContract.methods.getKey(keyId)
                .call({ from: account })
                .then((receipt) => {
                    console.log(receipt)
                    keys.push({
                        purpose: receipt['purpose'],
                        keyType: receipt['keyType'],
                        keyId: receipt['key'],
                    })
                })
                .catch((error) => {
                    console.log(error)
                    Report.failure(
                        'Error',
                        `${error.message} (${error.code})`,
                        'Okay'
                    )
                })
        })

        setIdentityKeys(keys)
    }

    /**
     * Gets all claims that the identity contract has. All claims will 
     * be passed into an object and loaded to the `identityClaims` state.
     * 
     * @see {@link module:IdentityLogin~IdentityClaimsState|IdentityClaimsState}
     * @async
     * @function getClaims
     */
    async function getClaims() {
        let claimIDs = []
        let claims = []

        // Get the IDs with topic 11 (Student Claim)
        await identityContract.methods.getClaimIdsByTopic(CLAIM_TYPES.SIT_STUDENT)
            .call({ from: account })
            .then((receipt) => {
                console.log(receipt)
                receipt.map((claim) => {
                    claimIDs.push(claim)
                })
            })
            .catch((error) => {
                console.log(error)
                Report.failure(
                    'Error',
                    `${error.message} (${error.code})`,
                    'Okay'
                )
            })

        // Get the IDs with topic 12 (Faculty Claim)
        await identityContract.methods.getClaimIdsByTopic(CLAIM_TYPES.SIT_FACULTY)
            .call({ from: account })
            .then((receipt) => {
                console.log(receipt)
                receipt.map((claim) => {
                    claimIDs.push(claim)
                })
            })
            .catch((error) => {
                console.log(error)
                Report.failure(
                    'Error',
                    `${error.message} (${error.code})`,
                    'Okay'
                )
            })

        // Makes a call to get each individual claim
        claimIDs.map(async (claimId) => {
            await identityContract.methods.getClaim(claimId)
                .call({ from: account })
                .then((receipt) => {
                    console.log(receipt)
                    claims.push({
                        topic: receipt['topic'],
                        scheme: receipt['scheme'],
                        issuer: receipt['issuer'],
                        signature: receipt['signature'],
                        data: receipt['data'],
                        uri: receipt['uri'],
                    })
                })
                .catch((error) => {
                    console.log(error)
                    Report.failure(
                        'Error',
                        `${error.message} (${error.code})`,
                        'Okay'
                    )
                })
        })

        setIdentityClaims(claims)
    }

    /**
     * Packs the Key information to be rendered to the `<Table>` HTML 
     * object.
     * 
     * @function showKeyData
     * @returns {Object} The elements to be rendered nested in the 
     * `<Table>` HTML object
     */
    function showKeyData() {
        let content = []

        // Ensure identity keys exist before rendering
        if (identityKeys === undefined) {
            return
        }

        identityKeys.map((key) => {
            content.push(
                <tr>
                    <td>{key.keyId}</td>
                    <td>{key.purpose}</td>
                    <td>{key.keyType}</td>
                </tr>
            )
        })
        return content
    }

    /**
     * Packs the Claim information to be rendered to the `<Table>` HTML 
     * object.
     * 
     * @function showClaimData
     * @returns {Object} The elements to be rendered nested in the 
     * `<Table>` HTML object
     */
    function showClaimData() {
        let content = []

        // Ensure identity keys exist before rendering
        if (identityClaims === undefined) {
            return
        }

        identityClaims.map((claim) => {
            console.log(claim)
            content.push(
                <tr>
                    <td>{claim.topic}</td>
                    <td>{claim.scheme}</td>
                    <td>{claim.issuer}</td>
                    <td>{claim.signature}</td>
                    <td>{claim.data}</td>
                    <td>{claim.uri}</td>
                </tr>
            )
        })

        return content
    }

    /**
     * Template for the displaying the identity details.
     * 
     * @function identityComponent
     * @returns {Object} The UI to be rendered for the Identity details 
     * component.
     */
    function identityComponent() {

        console.log(identityContract && identityAddress && identityKeys)

        // Display Identity details
        return (
            <Card style={{ marginTop: '50px' }}>
                <Card.Header className='display-5'>
                    My Identity: {identityAddress}
                </Card.Header>
                <Card.Body>
                    <Card>
                        <Card.Header className='h3'>Keys</Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Key ID</th>
                                        <th>Purpose</th>
                                        <th>Key Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showKeyData()}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Card style={{ marginTop: '15px' }}>
                        <Card.Header className='h3'>Claims</Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Topic</th>
                                        <th>Scheme</th>
                                        <th>Issuer</th>
                                        <th>Sign</th>
                                        <th>Data</th>
                                        <th>URI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showClaimData()}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>
        )
    }

    /**
     * @todo Complete the login function
     */
    async function login() {
        const address = DOMPurify.sanitize(document.querySelector('#identityAddress').value)
        
        const res = await signIn('credentials', {
            redirect: false,
            identity: address,
            callbackUrl: `${window.location.origin}`
        })
    }

    return (
        <>
            <Card>
                <Card.Header className='display-3'>
                    Digital Identity Login
                </Card.Header>
                <Card.Body>
                    {/* Transfer tokens form */}
                    <Form noValidate validated={validated} onSubmit={async (e) => {
                        // Prevent page refresh
                        e.preventDefault();
                        await login();
                    }}>
                        {/* Address Input */}
                        <Form.Group className="mb-3" controlId="identityAddress">
                            <Form.Label className='h6'>Identity Contract Address</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="lat1zg69v7yszg69v7yszg69v7yszg69v7y3q7dnwf"
                                size='lg'
                                onChange={async () => {
                                    // Sanitize user inputs before processing
                                    const address = DOMPurify.sanitize(document.querySelector('#identityAddress').value)

                                    // Set valid state according to server side validation rules
                                    validateAddress(address) ? setAddressValidated(true) : setAddressValidated(false)

                                    // Check if form is validated and ready to submit
                                    checkValid() ? setValidated(true) : setValidated(false)
                                }}
                                isValid={addressValidated}
                                isInvalid={!addressValidated}
                            />
                            {/* Valid Feedback */}
                            <Form.Control.Feedback>
                                Ok!
                            </Form.Control.Feedback>
                            {/* Invalid Feedback */}
                            <Form.Control.Feedback type='invalid'>
                                Please enter a valid ATON bech32 address (E.g. lat1rd8c02e905rguunal8ck77ftct0jph2v6zj7cq)
                            </Form.Control.Feedback>
                        </Form.Group>
                        {/* Create Identity */}
                        {/* <Button variant="outline-primary" onClick={async () => {
                        // Sanitize user inputs before processing
                        const address = DOMPurify.sanitize(document.querySelector('#identityAddress').value)
                        // Check identity
                        await createIdentity()
                    }}>
                        Create Identity
                    </Button> */}

                        <Row>
                            <Col md="auto">
                                {/* Check Identity */}
                                <Button variant="primary" onClick={async () => {
                                    // Sanitize user inputs before processing
                                    const address = DOMPurify.sanitize(document.querySelector('#identityAddress').value)
                                    // Check identity
                                    await checkIdentity(address) ? setIdentityValidated(true) : setIdentityValidated(false)
                                }} disabled={!addressValidated}>
                                    Check Contract
                                </Button>
                            </Col>
                            <Col md="auto">
                                {/* KYC Process */}
                                <DropdownButton
                                    variant='secondary'
                                    id="getClaimButton"
                                    title="Get Claim"
                                    disabled={!addressValidated && identityAddress}
                                >
                                    <Dropdown.Item onClick={() => { }}>Student Claim</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { }}>Faculty Claim</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col md="auto">
                                {/* Submit button */}
                                <Button variant="success" type="submit">
                                    Login
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>
            {identityContract && identityAddress && identityKeys && identityComponent()}
        </>
    )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}