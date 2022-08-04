import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import Head from 'next/head'
import Script from 'next/script'
import Header from './Header'
import Navbar from 'react-bootstrap/Navbar';

import WalletContext from '../context/WalletContext'

/**
 * @fileOverview The Layout component
 * @author Donovan Cham
 * 
 * @example
 * import Layout from '../components/Layout'
 * 
 * export default function Homepage {
 *   return (
 *     <Layout>
 *       <h1>Hello World</h1>
 *     </Layout>
 *   )
 * }
 */

/**
 * Provides a base template to that wraps around other components to 
 * form flesh out the web pages.
 * 
 * @module Layout
 */

export default function Layout({ children }) {

    return (
        <WalletContext>
            <Container fluid>
                <Head>
                    <title>SIT Metaverse</title>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
                    {/* Only Notify module js */}
                    <Script src="dist/notiflix-notify-aio-X.X.X.min.js"></Script>
                    {/* Only Report module js */}
                    <Script src="dist/notiflix-report-aio-X.X.X.min.js"></Script>
                    {/* Only Loading module js */}
                    <Script src="dist/notiflix-loading-aio-X.X.X.min.js"></Script>
                    {/* Only Confirm module js */}
                    <Script src="dist/notiflix-confirm-aio-X.X.X.min.js"></Script>
                </Head>
                {/* Navbar and header elements */}
                <Header />
                {/* Main Body */}
                <Container fluid>
                    {children}
                </Container>
            </Container>
            {/* Fixed Footer */}
            <footer>
                <Navbar fixed="bottom" variant='light' bg='light'>
                    <p className="col-md-4 mb-0 text-muted">© 2022 Singapore Institute of Technology</p>

                    <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                        <Image src='/static/SIT_logo_2.png' fluid height='70' width='70' />
                        {/* <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg> */}
                    </a>

                    <ul className="nav col-md-4 justify-content-end">
                        {/* <li className="nav-item"><a href="#" class="nav-link px-2 text-muted">Home</a></li>
                    <li className="nav-item"><a href="#" class="nav-link px-2 text-muted">Features</a></li>
                    <li className="nav-item"><a href="#" class="nav-link px-2 text-muted">Pricing</a></li>
                    <li className="nav-item"><a href="#" class="nav-link px-2 text-muted">FAQs</a></li> */}
                        <li className="nav-item">
                            <a href="https://www.flaticon.com/free-icons/flaticon" className="nav-link px-2 text-muted">
                                <Image src='/static/flaticon.png' fluid roundedCircle height='70' width='70' />
                            </a>
                        </li>
                    </ul>
                </Navbar>
            </footer>
        </WalletContext>
    )
}