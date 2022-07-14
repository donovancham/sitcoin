import { Container, Col, Button } from 'react-bootstrap'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { connectSamurai, useWalletContext } from '../context/WalletContext';

export default function Wallet() {
    const { account, setAccount, web3 } = useWalletContext()

    return (
        <Container>
            {/* Error Alert message that will pop-up when install fails */}
            {/* <h2>PlatON Wallet</h2> */}
            <Button variant="outline-success" size="md" onClick={async () => {
                // Ensure that samurai connected
                let result = await connectSamurai(web3)
                console.log(result)
                if (result !== false) {
                    // Sets wallet account
                    setAccount(accounts[0])

                    Notify.success('Connected to SIT Metaverse', {
                        clickToClose: true
                    })
                }
                else {
                    Notify.failure('Please allow permissions from wallet to connect account.', {
                        clickToClose: true
                    })
                }
            }}>
                Connect Wallet
            </Button>
            {/* <p>Your Address: {account}</p> */}
            <Button variant="outline-secondary" size="md" onClick={async () => {

            }}>
                Login
            </Button>
        </Container>
    )
}