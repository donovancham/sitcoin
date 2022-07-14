import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from "next/image";

import Wallet from '../components/Wallet'
import WalletContext from '../context/WalletContext'

export default function Header() {
    return (
        <Navbar variant="light" sticky="top">
            <Container>
                <Image src="/static/token.png" responsive width="45" height="45" />
                <Navbar.Brand href="/">
                    SIT Metaverse
                </Navbar.Brand>
                <Nav.Link href="#action1">Home</Nav.Link>
                <Nav.Link href="#action1">Home</Nav.Link>
                <Nav.Link href="#action1">Home</Nav.Link>
                <Navbar.Collapse className="justify-content-end">
                    {/* Connect Wallet Button */}
                    <Navbar.Text>
                        <WalletContext>
                            <Wallet />
                        </WalletContext>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}