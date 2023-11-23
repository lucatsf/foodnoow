import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import UserService from "@/services/UserService";

export const authOptions = {
  secret: process.env.SECRET_,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID_,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_,
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        name: { label: "Name", type: "text", placeholder: "Name" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        const userService = new UserService();
        const user = await userService.find({email});
        const passwordOk = user && bcrypt.compareSync(password, user.password);

        if (passwordOk) {
          return user
        }
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};