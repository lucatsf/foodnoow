import CompanyService from "@/services/CompanyService";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function GET(req) {
  await checkLimiter(req);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const service = new CompanyService();
  if (id) {
    const result = await service.find({id});
    return response(result, {req})
  }
  const result = await service.getAll();
  return response(result, {req})
}