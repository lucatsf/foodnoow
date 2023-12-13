import {companyOfUser, isAdmin, userAuth} from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/libs/auth";
import {getServerSession} from "next-auth";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";
import CheckoutService from "@/services/CheckoutService";

export async function GET(req) {
  await checkLimiter(req);

  const user = await userAuth();
  const admin = await isAdmin();
  const companyId = await companyOfUser();

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const orderService = new CheckoutService();

  if (id) {
    return response(await orderService.find({id}), {req} );
  }
  if (admin) {
    return response(await orderService.findAll({company_id: companyId}), {req} );
  }
  if (user?.id) {
    return response(await orderService.findAll({user_id: user?.id}), {req} );
  }
  return response({error: 'Usuário não encontrado'}, {req})
}

export async function PUT(req) {
  await checkLimiter(req);
  const {orderId, status} = await req.json();
  if (await isAdmin()) {
    const orderService = new CheckoutService();
    const result = await orderService.update({id: orderId, status});
    return response(result, {req})
  }
}