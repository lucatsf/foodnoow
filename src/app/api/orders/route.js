import {authOptions, companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import OrderService from "@/services/OrderService";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL_);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();
  const companyId = await companyOfUser();

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const orderService = new OrderService();
  if (id) {
    return Response.json( await orderService.find({id}) );
  }
  if (admin) {
    return Response.json( await orderService.findAll({company_id: companyId}) );
  }
  if (userEmail) {
    return Response.json( await orderService.findAll({userEmail}) );
  }
  return false;
}