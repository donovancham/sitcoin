import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react"

import { connectSamurai, useWalletContext } from '../context/WalletContext';

/**
 * @fileOverview The Header component
 * @author Donovan Cham
 * 
 * @see {@link module:WalletProvider|WalletContext}
 * 
 * @example
 * import Header from './Header';
 * 
 * export default function Homepage {
 *   return <Header />
 * }
 */

/**
 * Component for Header element. Renders a `Navbar` element that provides: 
 * - `Links` to other pages
 * - `Buttons` that allows user to connect his {@link https://platonnetwork.github.io/docs/en/Samurai_user_manual/|Samurai Wallet}
 * - UI that indicates the user's current login status
 * 
 * @module Header
 */

export default function Header() {

    /**
     * Imports the state variables for checking whether the wallet has 
     * been connected to the web3 dApp. The `refresh` state variable is 
     * used to refresh the context states and updates the states rendered 
     * for other components and pages.
     * 
     * @see {@link module:WalletProvider|WalletContext}
     * @const {Object} WalletContextState 
     * @property {Number} refresh - The refresh state counter
     * @property {Dispatch<SetStateAction<Number>>} setRefresh - The 
     * setter function for the refresh state variable
     * @property {String} account - Contains the account that is 
     * connected from the user's wallet
     * @property {Dispatch<SetStateAction<String>>} setAccount - The 
     * setter function for the account state variable
     * @property {Object} web3 - The web3 instance.
     */
    const { refresh, setRefresh, account, setAccount, web3 } = useWalletContext()

    /**
     * The session data required for checking whether the user has been 
     * logged in. 
     * 
     * @see {@link module:NextAuth|NextAuth}
     * @const {Object} SessionData
     * @property {Session} data - The session data
     */
    const { data: session } = useSession()

    /**
     * Connects to wallet from the browser and initializes variable states
     * @function initializeWallet
     * @async
     */
    const initializeWallet = async () => {
        // Ensure that samurai connected
        let result = await connectSamurai(web3)
        if (result !== false) {
            if (account === undefined) {
                // Sets wallet account
                setAccount(result)
            }
            else {
                // Refresh information
                setRefresh(refresh + 1)
            }
        }
    }

    /**
     * Template for connect `Button`
     * @function connectButton
     * @returns {Object} The HTML code to be rendered
     */
    const connectButton = () => {
        return (
            <Button variant="outline-success" size="md" onClick={initializeWallet}>
                Connect Wallet
            </Button>
        )
    }

    /**
     * Template for connected state `Button`
     * @function connectedButton
     * @returns {Object} The HTML code to be rendered
     */
    const connectedButton = () => {
        return (
            <Button variant="success" size="md" disabled>
                Connected
            </Button>
        )
    }

    /**
     * Template for refresh `Button`
     * @function refreshButton
     * @returns {Object} The HTML code to be rendered
     */
    const refreshButton = () => {
        return (
            <Button variant="outline-dark" size="md" onClick={async () => {
                setRefresh(refresh + 1)
            }}>
                Refresh
            </Button>
        )
    }

    return (
        <Navbar variant="light" sticky="top" className='bg-light bg-gradient'>
            <Container>
                <Image src="/static/token.png" width="45" height="45" />
                <Navbar.Brand href="/">
                    SIT Metaverse
                </Navbar.Brand>
                {/* Insert any navigation links you need here */}
                <Nav.Link href="/nftmarket" disabled={account ? false : true}>NFT Market</Nav.Link>
                <Nav.Link href="/login" disabled={account ? false : true}>Login</Nav.Link>
                <Navbar.Collapse className="justify-content-end">
                    {/* Refresh Button */}
                    <Navbar.Text>
                        {/* Show refresh button once account connected */}
                        {account ? refreshButton() : ''}
                    </Navbar.Text>
                    {/* Connect Wallet Button */}
                    <Navbar.Text>
                        {/* Error Alert message that will pop-up when install fails */}
                        {account ? connectedButton() : connectButton()}
                    </Navbar.Text>
                    {/* Current User identity information */}
                    <Navbar.Text>
                        <Button variant='secondary' disabled>
                            Identity: {session ? session.user.identity : 'None'}
                        </Button>
                    </Navbar.Text>
                    {/* Claim information if user verifies identity */}
                    <Navbar.Text>
                        <Button variant='danger' disabled>
                            Claim: {session
                                ? (
                                    (session.user.claimType === 11 && 'Student Claim') ||
                                    (session.user.claimType === 22 && 'Faculty Claim')
                                )
                                : 'None'}
                        </Button>
                    </Navbar.Text>
                    {/* Logout button */}
                    {
                        // Only show logout button if logged in
                        session &&
                        <Navbar.Text>
                            <Button variant='outline-dark' disabled>
                                Identity: {session ? session.user.identity : 'None'}
                            </Button>
                        </Navbar.Text>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}