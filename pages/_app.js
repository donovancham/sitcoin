// Global configuration file
// Use to keep states between pages
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>SIT Metaverse</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                {/* Only Notify module js */}
                <Script src="dist/notiflix-notify-aio-X.X.X.min.js"></Script>
                {/* Only Report module js */}
                <Script src="dist/notiflix-report-aio-X.X.X.min.js"></Script>
            </Head>
            <Component {...pageProps} />
        </>
    )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }