import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"
//Función que autentica las credenciales de Google
export const authOptions = {
    providers: [GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })],
}

export default NextAuth(authOptions);