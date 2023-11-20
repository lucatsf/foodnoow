import clientPromise from "@/libs/mongoConnect";
import bcrypt from "bcrypt";
import NextAuth, {getServerSession} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import UserService from "@/services/UserService";
import UserInfoService from "@/services/UserInfoService";

export const authOptions = {
  secret: process.env.SECRET_,
  adapter: MongoDBAdapter(clientPromise),
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
  },
  secret: process.env.SECRET_,
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfoService = new UserInfoService();
  const userInfo = await userInfoService.find({email: userEmail});
  if (!userInfo) {
    return false;
  }
  return userInfo.admin;
}

export async function isRoot() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfoService = new UserInfoService();
  const userInfo = await userInfoService.find({email: userEmail});
  if (!userInfo) {
    return false;
  }
  return userInfo.root;
}

export async function companyOfUser() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfoService = new UserInfoService();
  const userInfo = await userInfoService.find({email: userEmail});
  if (!userInfo) {
    return false;
  }
  return userInfo.company_id;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }