import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react"

import { connectSamurai, useWalletContext } from '../context/WalletContext';

export default function Header() {
    const { refresh, setRefresh, account, setAccount, web3 } = useWalletContext()

    const { data: session } = useSession()

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

    const connectButton = () => {
        return (
            <Button variant="outline-success" size="md" onClick={initializeWallet}>
                Connect Wallet
            </Button>
        )
    }

    const connectedButton = () => {
        return (
            <Button variant="success" size="md" disabled>
                Connected
            </Button>
        )
    }

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