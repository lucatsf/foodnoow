import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import UserService from "@/services/UserService";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function GET(req) {
  await checkLimiter(req);
  if (await isAdmin()) {
    const companyId = await companyOfUser();
    const userService = new UserService();
    return response(await userService.getAll({company_id: companyId}), {req});
  } else {
    return response([], {req});
  }
}