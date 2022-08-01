// https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
    providers: [
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
            async authorize(credentials, req) {
                // Logic to authorize the user credentials
                const payload = {
                    identity: credentials.identity,
                    claimType: credentials.claimType,
                    data: credentials.data,
                    signature: credentials.signature,
                }

                // TODO: Create API route accepting POST content to verify the signature
                
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
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        // async signIn({ credentials }) {
        //     // Ensure that the user owns the identity Contract
        // },
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