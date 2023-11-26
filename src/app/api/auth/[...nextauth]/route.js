import NextAuth, {getServerSession} from "next-auth";
import UserService from "@/services/UserService";
import UserInfoService from "@/services/UserInfoService";
import CompanyService from "@/services/CompanyService";
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

  const company_id = userInfo?.company_id;
  const companyService = new CompanyService();
  let company = null;
  if (company_id) {
    company = await companyService.find({id: company_id});
  }
   
  return {
    ...user,
    ...userInfo,
    company: company ? company : null,
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }