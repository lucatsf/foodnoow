import { response } from "@/libs/response";
import { checkLimiter } from "../config/limiter";
import CheckoutService from "@/services/CheckoutService";

export async function POST(req) {
  await checkLimiter(req);
  const data = await req.json();
  const checkoutService = new CheckoutService();
  const checkout = await checkoutService.create(data);
  return response(checkout, {req})
}