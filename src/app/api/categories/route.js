import { checkLimiter } from "@/app/api/config/limiter";
import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import CategoryService from "@/services/CategoryService";
import { response } from "@/libs/response";

export async function POST(req) {
  await checkLimiter(req);
  const {name} = await req.json();
  if (!name) {
    throw new Error('Nome é obrigatório');
  }
  if (await isAdmin()) {
    const company_id = await companyOfUser();
    const categoryService = new CategoryService();
    const result = await db.create({name, company_id});
    return response(result, {req})
  }
}

export async function PUT(req) {
  await checkLimiter(req);
  const {id, name} = await req.json();
  if (!id || !name) {
    throw new Error('Nome e id são obrigatórios');
  }
  if (await isAdmin()) {
    const company_id = await companyOfUser();
    const db = new CategoryService();
    const result = await db.update({id, name, company_id});
    return response(result, {req})
  }
  return response(true, {req})
}

export async function GET(req) {
  await checkLimiter(req);
  const categoryService = new CategoryService();
  if (await isAdmin()) {
    const companyId = await companyOfUser();
    const result = await categoryService.getAll({ company_id: companyId});
    return response(result, {req})
  }
  const result = await categoryService.getAll();
  return response(result, {req})
}

export async function DELETE(req) {
  await checkLimiter(req);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    throw new Error('Id is required');
  }
  if (await isAdmin()) {
    const categoryService = new CategoryService();
    await categoryService.delete(id);
    return response(true, {req})
  }
  return response(true, {req})
}