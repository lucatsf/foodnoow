import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/libs/auth";
import OrderService from "@/services/OrderService";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function GET(req) {
  await checkLimiter(req);
  mongoose.connect(process.env.MONGO_URL_);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();
  const companyId = await companyOfUser();

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const orderService = new OrderService();
  if (id) {
    return response( await orderService.find({id}), {req} );
  }
  if (admin) {
    return response( await orderService.findAll({company_id: companyId}), {req} );
  }
  if (userEmail) {
    return response( await orderService.findAll({userEmail}), {req} );
  }
  return false;
}