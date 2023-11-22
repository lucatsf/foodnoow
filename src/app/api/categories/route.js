import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import CategoryService from "@/services/CategoryService";

export async function POST(req) {
  const {name} = await req.json();
  if (!name) {
    throw new Error('Nome é obrigatório');
  }
  if (await isAdmin()) {
    const company_id = await companyOfUser();
    const categoryService = new CategoryService();
    const result = await db.create({name, company_id});
    return Response.json(result);
  }
}

export async function PUT(req) {
  const {id, name} = await req.json();
  if (!id || !name) {
    throw new Error('Nome e id são obrigatórios');
  }
  if (await isAdmin()) {
    const company_id = await companyOfUser();
    const db = new CategoryService();
    const result = await db.update({id, name, company_id});
    return Response.json(result);
  }
  return Response.json(true);
}

export async function GET() {
  const categoryService = new CategoryService();
  if (await isAdmin()) {
    const companyId = await companyOfUser();
    const result = await categoryService.getAll({ company_id: companyId});
    return Response.json(result);
  }
  const result = await categoryService.getAll();
  return Response.json(result);
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    throw new Error('Id is required');
  }
  if (await isAdmin()) {
    const categoryService = new CategoryService();
    await categoryService.delete(id);
    return Response.json(true);
  }
  return Response.json(true);
}