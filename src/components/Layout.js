import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import Head from 'next/head'
import Script from 'next/script'
import Header from './Header'

export default function Layout({ children }) {
    return (
        <>
            <Container className="container-fluid">
                <Head>
                    <title>SIT Metaverse</title>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
                    {/* Only Notify module js */}
                    <Script src="dist/notiflix-notify-aio-X.X.X.min.js"></Script>
                    {/* Only Report module js */}
                    <Script src="dist/notiflix-report-aio-X.X.X.min.js"></Script>
                </Head>
                <Header />
                <Container fluid>
                    <Row>
                        {children}
                    </Row>
                </Container>
            </Container>
            <footer>
                <div className='fixed-bottom'>
                    <Card>
                        <Card.Body>
                            <Card.Link href="https://www.flaticon.com/free-icons/flaticon" title="flaticon icons">
                                <Image src='/static/flaticon.png' fluid roundedCircle height='70' width='70'/>
                                Flaticon icons created by Freepik - Flaticon
                            </Card.Link>
                        </Card.Body>
                    </Card>
                </div>
            </footer>
        </>


    )
}