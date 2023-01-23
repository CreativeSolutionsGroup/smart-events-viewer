import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
        }
    }
}

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env["GOOGLE_CLIENT_ID"],
            clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        }),
    ]
})