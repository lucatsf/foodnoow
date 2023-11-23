import { response } from "@/libs/response";
import { checkLimiter } from "../config/limiter";

export async function POST(req) {
  await checkLimiter(req);
  return response({ message: 'Method Not Allowed' }, {req})
}