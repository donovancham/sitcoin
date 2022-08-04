import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import Form from 'react-bootstrap/Form';
import DOMPurify from 'isomorphic-dompurify';

import { useWalletContext } from '../context/WalletContext';

/**
 * @fileOverview The Wallet Component
 * @author Donovan Cham
 * 
 * @example
 * import WalletContext from '../context/WalletContext'
 * import Wallet from '../components/Wallet'
 * 
 * export default function Homepage {
 *   return (
 *      <WalletContext>
 *        <Wallet />
 *      </WalletContext>
 *   )
 * }
 */

/**
 * Component for the Wallet UI. Provides functionality to allow 
 * users to view basic information about their wallet and perform 
 * actions such as transfer tokens or burn tokens.
 * 
 * @module Wallet
 */

export default function Wallet() {
    /**
     * Imports the state variables for the wallet component. Get states 
     * that hold the wallet information to be displayed to the user. The 
     * `refresh` state variable is used to refresh the context states 
     * and updates the states rendered for other components and pages.
     * 
     * @see {@link module:WalletProvider|WalletContext}
     * @see {@link module:WalletProvider~getContractInfo|WalletContext}
     * 
     * @const {Object} WalletContextState 
     * @property {String} account - The connected user wallet account
     * @property {String} network - The currently connected network
     * @property {String} tokenContract - The `SITcoin` contract instance
     * @property {String} tokenName - The token name
     * @property {String} tokenSymbol - The token symbol
     * @property {String} tokenSupply - The token supply
     * @property {String} tokenBalance - The token balance of the user 
     * wallet
     * @property {Object} web3 - The web3 instance
     * @property {function} getContractInfo - Refreshes state information 
     * for the token contract variables
     */
    const {
        account,
        network,
        tokenContract,
        tokenName,
        tokenSymbol,
        tokenSupply,
        tokenBalance,
        web3,
        getContractInfo,
    } = useWalletContext()

    // Constant to render to the UI when not user wallet not connected
    const notConnected = 'Loading...'

    /**
     * Form validation criteria for both transfer token and burn token 
     * forms.
     * 
     * @const {Object} TokenFormState
     * @property {Boolean} addressValidated Validation flag for `address` input
     * @property {Dispatch<SetStateAction<Boolean>>} setAddressValidated 
     * Sets the validation state for the `address` input
     * @property {Boolean} amountValidated Validation flag for `amount` input
     * @property {Dispatch<SetStateAction<Boolean>>} setAmountValidated 
     * Sets the validation state for the `amount` input
     * @property {Boolean} validated Validation flag for `transferToken` form
     * @property {Dispatch<SetStateAction<Boolean>>} setValidated 
     * Sets the overall validation state for the `transferToken` form
     * @property {Boolean} burnValidated Validation flag for `burnToken` form
     * @property {Dispatch<SetStateAction<Boolean>>} setBurnValidated 
     * Sets the overall validation state for the `burnToken` form
     */
    const [addressValidated, setAddressValidated] = useState(false);
    const [amountValidated, setAmountValidated] = useState(false);
    const [validated, setValidated] = useState(false);
    const [burnValidated, setBurnValidated] = useState(false);

    /**
     * Transfers tokens from the user wallet to another wallet.
     * 
     * @async
     * @function transferFunds
     * @param {String} to The wallet address to send the tokens to
     * @param {Number} amount The amount of money to send
     */
    const transferFunds = async (to, amount) => {
        // Execute Transfer
        Loading.hourglass('Executing Transfer...')

        await tokenContract.methods.transfer(to, amount).estimateGas({ from: account })
            .then(async (gasAmount) => {
                console.log(`Estimated gas = ${gasAmount}, ${typeof (gasAmount)}`)
                await tokenContract.methods.transfer(to, amount)
                    .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                    .then((receipt) => {
                        console.log(receipt)

                        // Display the transaction results to the user
                        Report.success(
                            'Transfer Successful',
                            `
                            <div class="container-lg">
                            <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item list-group-item-primary col-md-4">Transaction Hash</li>
                                    <li class="list-group-item list-group-item-action col-md-6 text-wrap">
                                        ${receipt.transactionHash}
                                    </li>
                                </ul>
                                <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item list-group-item-primary col-md-4">Transaction Hash</li>
                                    <li class="list-group-item list-group-item-action col-md-6">
                                        <a class='text-wrap'>${receipt.transactionHash}</a>
                                    </li>
                                </ul>
                                <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item list-group-item-dark col-md-4">Gas</li>
                                    <li class="list-group-item list-group-item-action">
                                        ${
                            // Convert to von first before converting back to LAT
                            web3.utils.fromVon(
                                web3.utils.toVon(receipt.cumulativeGasUsed.toString(), 'gvon'),
                                'lat') + ' ' + 'LAT'
                            }
                                    </li>
                                </ul>
                                <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item list-group-item-danger col-md-4">From</li>
                                    <li class="list-group-item list-group-item-action">${receipt.events.Transfer.returnValues.from}</li>
                                </ul>
                                <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item list-group-item-success col-md-4">To</li>
                                    <li class="list-group-item list-group-item-action">${receipt.events.Transfer.returnValues.to}</li>
                                </ul>
                                <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item list-group-item-warning col-md-4">Amount</li>
                                    <li class="list-group-item list-group-item-action">
                                        ${receipt.events.Transfer.returnValues.value + ' ' + tokenSymbol}
                                    </li>
                                </ul>
                                <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item list-group-item-info col-md-4">Status</li>
                                    <li class="list-group-item list-group-item-action">${receipt.status}</li>
                                </ul>
                            </div>
                            `,
                            'Okay',
                            {
                                width: '650px',
                                messageMaxLength: 3000,
                                plainText: false
                            }
                        )

                        // Update States
                        getContractInfo()
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
            .catch((err) => {
                console.log(err)
            })

        Loading.remove()
    }

    /**
     * Handles the validation of the `transferToken` form when the submit 
     * button is clicked. If validated, {@link transferFunds} function 
     * will be called to transfer tokens. If not validated, user will not 
     * be able to proceed.
     * 
     * @function transferTokens
     * @param {React.MouseEvent<HTMLElement>} event The event fired after 
     * the submit button is clicked
     */
    const transferTokens = (event) => {
        // Prevents page from reloading
        event.preventDefault();

        // Ensure that the wallet is connected
        if (tokenBalance === undefined) {
            Notify.failure('Please connect wallet before transferring', {
                clickToClose: true
            })
        }
        else {
            const form = event.currentTarget;
            console.log(`Form Valid? ${form.checkValidity()}`)

            const address = DOMPurify.sanitize(document.querySelector('#transferAddress').value)
            const amount = DOMPurify.sanitize(document.querySelector('#transferAmount').value)

            // Ensure that the form is valid and the other inputs are validated
            if (form.checkValidity() === true && addressValidated && amountValidated) {
                transferFunds(address, amount);
            }
        }
    };

    /**
     * Burns the amount specified that the user's wallet owns.
     * 
     * @async
     * @function burnTokens
     * @param {Number} amount The amount to be burnt
     */
    async function burnTokens(amount) {
        // Ensure that user has sufficient tokens to burn
        if (amount > tokenBalance) {
            Report.warning(
                'Insufficient Tokens',
                `Please do not burn more tokens that what you own. Balance: ${tokenBalance}, Burning: ${amount}`,
                'Okay'
            )
        }
        else {
            Loading.hourglass('Burning Tokens...')

            await tokenContract.methods.burn(amount)
                .estimateGas({ from: account })
                .then(async (gasAmount) => {
                    console.log(`Estimated gas = ${gasAmount}`)
                    await tokenContract.methods.burn(amount)
                        .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                        .then((receipt) => {
                            Report.success(
                                'Burnt Tokens',
                                `${amount} SITC successfully burnt!`,
                                'Okay'
                            )

                            // Update States
                            getContractInfo()
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

            Loading.remove()
        }
    }

    /**
     * Validates the `address` input to ensure it is a valid 
     * {@link https://devdocs.platon.network/docs/en/JS_SDK#web3utilsisbech32address|PlatON Bech32} 
     * address.
     * 
     * @function validateAddress
     * @param {String} address The `address` input
     * @returns {Boolean} True if `address` is validated
     */
    function validateAddress(address) {
        // Check if address is valid
        if (web3.utils.isBech32Address(address) === false) {
            return false
        }

        if (address == account) {
            Notify.failure('Cannot send yourself SIT coins! Please input another address.', {
                clickToClose: true
            })

            return false
        }

        return true
    }

    /**
     * Ensures that the `amount` input is not 0 or less.
     * 
     * @function validateAmount
     * @param {Number} amount The `amount` input 
     * @returns {Boolean} True if `amount` is valid
     */
    const validateAmount = (amount) => {
        // Chops off any decimal places and converts to number
        const amt = Math.floor(Number(amount))

        console.log(`Amount: ${amt}`)

        if (amt <= 0) {
            return false
        }

        if (amt > tokenBalance) {
            Notify.failure('Amount cannot be more than what you own.', {
                clickToClose: true
            })
            return false
        }

        return true
    }

    /**
     * Checks if the form is validated
     * 
     * @function checkValid
     * @returns {Boolean} True if form is validated
     */
    function checkValid() {
        if (addressValidated && amountValidated) {
            return true
        }
        return false
    }

    return (
        <Container>
            <Tab.Container id='wallet-info' defaultActiveKey='network'>
                <Card className='bg-light'>
                    <Card.Header>
                        <Nav variant="pills" defaultActiveKey="#network">
                            <Nav.Item>
                                <Nav.Link eventKey='network' href='#network'>Network</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='wallet' href='#wallet'>Wallet</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='transfer' href='#transfer'>Transfer</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='burn' href='#burn'>Burn Tokens</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Tab.Content>
                        {/* Network Tab */}
                        <Tab.Pane eventKey='network' title='network'>
                            <Card.Body>
                                <Card.Title>Network Overview</Card.Title>
                                {/* Network information */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='danger' className='col-md-4'>
                                        <h5>Network Connected</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item className='col'>
                                        {network ? network : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                                {/* SITcoin Total Supply */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='warning' className='col-md-4'>
                                        <h5>Token Supply</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item className='col'>
                                        {tokenSupply ? tokenSupply : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Tab.Pane>
                        {/* Wallet Tab */}
                        <Tab.Pane eventKey='wallet' title='Wallet'>
                            <Card.Body>
                                <Card.Title>My Wallet</Card.Title>
                                {/* Account Address */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='primary' className='col-md-4'>
                                        <h5>Wallet Address</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item className='col'>
                                        {account ? account : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                                {/* Account Currency */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='info' className='col-md-4'>
                                        <h5>{tokenName} {' '}Balance</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item className='col'>
                                        {tokenBalance ? tokenBalance + ' ' + tokenSymbol : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Tab.Pane>
                        {/* Transfer Tab */}
                        <Tab.Pane eventKey='transfer' title='Transfer'>
                            <Card.Body>
                                <Card.Title>Transfer Tokens</Card.Title>
                                {/* Transfer tokens form */}
                                <Form noValidate validated={validated} onSubmit={transferTokens}>
                                    {/* Address Input */}
                                    <Form.Group className="mb-3" controlId="transferAddress">
                                        <Form.Label className='h6'>Receiver Address</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Receiver Address"
                                            size='lg'
                                            onChange={() => {
                                                // Sanitize user inputs before processing
                                                const address = DOMPurify.sanitize(document.querySelector('#transferAddress').value)

                                                // Set valid state according to server side validation rules
                                                validateAddress(address) ? setAddressValidated(true) : setAddressValidated(false)

                                                // Check if form is validated and ready to submit
                                                checkValid() ? setValidated(true) : setValidated(false)
                                                console.log(`Validated: ${validated}`)
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
                                    {/* Amount input */}
                                    <Form.Group className="mb-3" controlId="transferAmount">
                                        <Form.Label className='h6'>Amount</Form.Label>
                                        <Form.Control
                                            required
                                            type="number"
                                            placeholder="SITC to transfer"
                                            onChange={() => {
                                                // Sanitize user inputs before processing
                                                const amount = DOMPurify.sanitize(document.querySelector('#transferAmount').value)

                                                // Set valid state according to server side validation rules
                                                validateAmount(amount) ? setAmountValidated(true) : setAmountValidated(false)

                                                // Check if form is validated and ready to submit
                                                checkValid() ? setValidated(true) : setValidated(false)
                                                console.log(`Validated: ${validated}`)
                                            }}
                                            isValid={amountValidated}
                                            isInvalid={!amountValidated}
                                        />
                                        {/* Valid Feedback */}
                                        <Form.Control.Feedback>
                                            Ok!
                                        </Form.Control.Feedback>
                                        {/* Invalid Feedback */}
                                        <Form.Control.Feedback type='invalid'>
                                            Amount cannot be 0 or less.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {/* Submit button */}
                                    <Button variant="success" type="submit" disabled={tokenBalance ? false : true}>
                                        Transfer
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Tab.Pane>
                        {/* Burn Tokens Tab */}
                        <Tab.Pane eventKey='burn' title='Burn Tokens'>
                            <Card.Body>
                                <Card.Title>Burn Tokens</Card.Title>
                                {/* Transfer tokens form */}
                                <Form noValidate validated={burnValidated} onSubmit={(e) => {
                                    // Prevent page from refreshing when the form is submitted
                                    e.preventDefault();
                                    const amount = DOMPurify.sanitize(document.querySelector('#burnAmount').value)

                                    // Calls the function to burn tokens
                                    burnTokens(amount)
                                }}>
                                    {/* Amount input */}
                                    <Form.Group className="mb-3" controlId="burnAmount">
                                        <Form.Label className='h6'>Amount</Form.Label>
                                        <Form.Control
                                            required
                                            type="number"
                                            placeholder="Tokens to Burn"
                                            onChange={() => {
                                                // Sanitize user inputs before processing
                                                const amount = DOMPurify.sanitize(document.querySelector('#burnAmount').value)

                                                // Set valid state according to server side validation rules
                                                validateAmount(amount) ? setBurnValidated(true) : setBurnValidated(false)
                                            }}
                                            isValid={burnValidated}
                                            isInvalid={!burnValidated}
                                        />
                                        {/* Valid Feedback */}
                                        <Form.Control.Feedback>
                                            Ok!
                                        </Form.Control.Feedback>
                                        {/* Invalid Feedback */}
                                        <Form.Control.Feedback type='invalid'>
                                            Amount cannot be 0 or less.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {/* Submit button */}
                                    <Button variant="danger" type="submit" disabled={tokenBalance ? false : true}>
                                        Burn
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Tab.Pane>
                    </Tab.Content>
                </Card>
            </Tab.Container>

        </Container >
    )

}