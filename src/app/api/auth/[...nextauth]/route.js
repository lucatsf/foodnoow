import NextAuth, {getServerSession} from "next-auth";
import UserService from "@/services/UserService";
import UserInfoService from "@/services/UserInfoService";
import { authOptions } from "@/libs/auth";


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
  return userInfo?.admin;
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

export async function userAuth() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userService = new UserService();
  const user = await userService.find({email: userEmail});
  if (!user) {
    return false;
  }
  const userInfoService = new UserInfoService();
  const userInfo = await userInfoService.find({email: userEmail});
  return {
    ...user,
    ...userInfo,
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }