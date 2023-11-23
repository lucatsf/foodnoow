import { response } from "@/libs/response";
import { checkLimiter } from "../config/limiter";

export async function GET(req) {
  await checkLimiter(req);
  return response({ message: 'Hello World' }, {req})
}