import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

/**
 * @fileOverview Authentication framework from `NextAuth.js`
 * @author Donovan Cham
 * 
 * @see {@link https://next-auth.js.org/|NextAuth.js}
 */

/**
 * Auth framework for the Login Component. Uses the dynamic api route 
 * handler from Next JS to deliver the `NextAuth.js` default routes. 
 * 
 * All requests to `/api/auth/*` (`signIn`, `callback`, `signOut`, etc.) 
 * will automatically be handled by NextAuth.js.
 * 
 * @module NextAuth
 * @see {@link https://nextjs.org/docs/api-routes/dynamic-api-routes|Dynamic API Routes}
 * @see {@link https://next-auth.js.org/getting-started/example| NextAuth examples}
 * @see {@link https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/| NextAuth Tutorial}
 * 
 * @todo Create API route accepting POST content to verify the signature
 */

/**
 * The options configured for the NextAuth framework. Customized options 
 * are set for the use of a custom login page and the authorization 
 * provider is set to `credentials` for a custom authentication process 
 * that can be implemented in the `authorize()` function.
 * 
 * @name ConfigOptions
 * @property {Object} providers Configures the authentication provider
 * @property {String} secret Configures the secret key used for encrypting 
 * and decrypting session data.
 * @property {Object} pages Defines custom login pages 
 * @property {Object} callbacks Asynchronous functions to handle actions 
 * @property {Object} theme Colour scheme for default login page
 * @property {Object} jwt Configure the options for JSON Web Tokens
 * 
 * @see {@link https://jwt.io/introduction|JSON Web Tokens}
 */
export default NextAuth({
    providers: [
        /**
         * Authenticates the user using the credentials provided.
         * 
         * @name CredentialsProvider
         * @property {String} name The name to display on the sign in form
         * @property {Object} credentials Defines the variables to be 
         * passed into the authentication backend for authorizing the user
         * @property {function} authorize The custom function that 
         * implements how the authentication is handled with the credentials
         */
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Digital Identity Login",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                identity: {
                    label: "Identity",
                    type: "text",
                    placeholder: "lax1zg69v7yszg69v7yszg69v7yszg69v7y3q7dnwf",
                    required: true,
                },
                claimType: {
                    label: "Claim Type",
                    type: "number",
                    required: true,
                },
                data: {
                    label: "Data",
                    type: "text",
                    required: true,
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    required: true,
                },
            },
            /**
             * The custom function to handle sign in requests from the 
             * credentials passed to the auth handler.
             * 
             * @async
             * @function authorize
             * @param {Object} credentials The object containing the 
             * credentials that the user input
             * @param {Object} req The HTTP request that was passed when 
             * calling this API route
             * @returns {Promise<User>}
             */
            async authorize(credentials, req) {
                // Logic to authorize the user credentials
                const payload = {
                    identity: credentials.identity,
                    claimType: credentials.claimType,
                    data: credentials.data,
                    signature: credentials.signature,
                }

                /**
                 * @todo Create API route accepting POST content to verify the signature
                 */
                
                // const res = await fetch('http://localhost:3000/api/verify', {
                //     method: 'POST',
                //     body: JSON.stringify(payload),
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Accept-Language': 'en-US',
                //     },
                // })

                // const user = await res.json()
                // if (!res.ok) {
                //     throw new Error(user.exception)
                // }

                // if (res.ok && user) {
                //     return user
                // }

                // Login Failed
                return null;
            },
        }),
    ],
    // Configure secret key here
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: user.data.token,
                    refreshToken: user.data.refreshToken,
                }
            }

            return token;
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.accessTokenExpires = token.accessTokenExpires;

            return session
        },
    },
    theme: {
        colorScheme: 'auto', // "auto" | "dark" | "light"
        brandColor: '', // Hex color code #33FF5D
        logo: '/static/SIT_logo_2.png', // Absolute URL to image
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true,
    },
})