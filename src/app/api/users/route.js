import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import UserService from "@/services/UserService";

export async function GET() {
  if (await isAdmin()) {
    const companyId = await companyOfUser();
    const userService = new UserService();
    return Response.json(await userService.getAll({company_id: companyId}));
  } else {
    return Response.json([]);
  }
}