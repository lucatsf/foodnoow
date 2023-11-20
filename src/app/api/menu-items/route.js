import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import MenuItemService from "@/services/MenuItemService";

export async function POST(req) {
  const data = await req.json();

  if (await isAdmin()) {
    const company_id = await companyOfUser();
    const menuItemService = new MenuItemService();
    const basePrice = parseFloat(data.basePrice);
    data.basePrice = basePrice;
    const result = await menuItemService.create({...data, company_id});
    return Response.json(result);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  if (await isAdmin()) {
    const {id, ...data} = await req.json();
    const company_id = await companyOfUser();
    const menuItemService = new MenuItemService();
    const basePrice = parseFloat(data.basePrice);
    data.basePrice = basePrice;
    const result = await menuItemService.update({...data, company_id, id});
    return Response.json(result);
  }
  return Response.json(true);
}

export async function GET() {
  const isAdmin = await isAdmin();
  const companyId = await companyOfUser();
  const menuItemService = new MenuItemService();

  if (isAdmin) {
    const result = await menuItemService.getAll({ company_id: companyId});
    return Response.json(result);
  }
  const result = await menuItemService.getAll();
  return Response.json(result);
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (await isAdmin()) {
    const menuItemService = new MenuItemService();
    await menuItemService.delete(id);
    return Response.json(true);
  }
  return Response.json(true);
}