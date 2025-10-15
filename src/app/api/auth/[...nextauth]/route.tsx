// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import { transaction } from '@/app/utils/axios';
import setCookies from "./cookies";

const handler = NextAuth({
    
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),

		CredentialsProvider({	
			name: 'Credentials',
			credentials: {
				email: { label: "email", type: "text" },
				password: {  label: "Password", type: "password" }
			},

			async authorize(credentials) {
				const user = {id:"", email:"", refreshToken:"", obj:{}};
				let success = false;

				await transaction("post", "user/signin", credentials, signinCallback, true, false, "", null);
				
				function signinCallback(obj:any){
					if(obj.sendObj.success === 'y'){
						success = true;
						user.id = obj.sendObj.resObj.id
						user.email = obj.sendObj.resObj.email
						user.refreshToken = obj.refreshToken
						user.obj = obj.sendObj
					}

					if(obj.refreshToken){

					 	setCookies(obj.refreshToken);
					}
				}

				if(success){
					return user
				}
				
				return null
			}
		})
	],
	callbacks: {        
		async signIn({ user, account}) {
			if(account){
				if(account.provider === "google"){
					try{
						const obj = await transaction("post", "user/googlesignin", user, "", false, false, "", null);
					  if(obj.refreshToken){
							setCookies(obj.refreshToken);
						}else{
							return false;
						}
					}catch{
						return false;
					}
				}				
			}
			return true;
		},

		async jwt({ token }) {

			return token;
		},
		async session({ session }) {
			return session;
		},
		
	},
	pages: {
		signIn: "/", // custom sign-in page's url 
		error: '/loginfail', 
	},
    
  });

export { handler as GET, handler as POST };