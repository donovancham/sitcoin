// Global configuration file
// Use to keep states between pages
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.css'
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session} refetchInterval={0}>
            <Component {...pageProps} />
        </SessionProvider>
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