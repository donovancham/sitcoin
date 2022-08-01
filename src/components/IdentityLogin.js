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

export default function IdentityLogin({ csrfToken }) {
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

    const { account, setAccount, refresh, web3 } = useWalletContext()

    const [serverWeb3, setServerWeb3] = useState()
    const [validated, setValidated] = useState(false)
    const [addressValidated, setAddressValidated] = useState(false)
    const [identityValidated, setIdentityValidated] = useState(false)
    const [identityContract, setIdentityContract] = useState()
    const [identityAddress, setIdentityAddress] = useState()
    const [identityKeys, setIdentityKeys] = useState()
    const [identityClaims, setIdentityClaims] = useState()

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

    useEffect(() => {
        const getDetails = async () => {
            await getKeys();
            await getClaims();
        }

        console.log(identityContract)

        if (identityContract !== undefined) {
            getDetails();
            console.log(identityKeys)
            console.log(identityClaims)
        }

    }, [identityContract, refresh])

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

    async function createStudentClaim() {

    }

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

    function validateAddress(address) {
        // Check if address is valid
        return web3.utils.isBech32Address(address)
    }

    function checkValid() {
        return addressValidated && identityValidated
    }

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