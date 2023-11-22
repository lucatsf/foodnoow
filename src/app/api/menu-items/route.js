import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import MenuItemService from "@/services/MenuItemService";

export async function POST(req) {
  const data = await req.json();
  if (
    (!data?.name || data?.name == '')||
    (!data.description || data.description == '') ||
    (!data.basePrice || data.basePrice == '') ||
    (!data.category_id || data.category_id == '')
  ) {
    throw new Error('Por favor, preencha todos os campos');
  }
  if (data?.sizes?.length > 0) {
    for (const size of data.sizes) {
      if (!size?.name || size.name == '' || !size?.price || size.price == '') {
        throw new Error('Por favor, preencha todos os campos de tamanho');
      }
    }
  }
  if (data?.extraIngredientPrices?.length > 0) {
    for (const extraIngredientPrice of data.extraIngredientPrices) {
      if (
        !extraIngredientPrice?.name ||
        extraIngredientPrice.name == '' ||
        !extraIngredientPrice?.price ||
        extraIngredientPrice.price == ''
      ) {
        throw new Error('Por favor, preencha todos os campos de acompanhamento');
      }
    }
  }
  if (await isAdmin()) {
    const company_id = await companyOfUser();
    const menuItemService = new MenuItemService();
    data.basePrice = parseFloat(data.basePrice);
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
    if (
      (!data?.name || data?.name == '')||
      (!data.description || data.description == '') ||
      (!data.basePrice || data.basePrice == '') ||
      (!data.category_id || data.category_id == '')
    ) {
      throw new Error('Por favor, preencha todos os campos');
    }
    if (data?.sizes?.length > 0) {
      for (const size of data.sizes) {
        if (!size?.name || size.name == '' || !size?.price || size.price == '') {
          throw new Error('Por favor, preencha todos os campos de tamanho');
        }
      }
    }
    if (data?.extraIngredientPrices?.length > 0) {
      for (const extraIngredientPrice of data.extraIngredientPrices) {
        if (
          !extraIngredientPrice?.name ||
          extraIngredientPrice.name == '' ||
          !extraIngredientPrice?.price ||
          extraIngredientPrice.price == ''
        ) {
          throw new Error('Por favor, preencha todos os campos de acompanhamento');
        }
      }
    }
    const menuItemService = new MenuItemService();
    data.basePrice =  parseFloat(data?.basePrice);
    const result = await menuItemService.update({...data, company_id, id});
    return Response.json(result);
  }
  return Response.json(true);
}

export async function GET() {
  const companyId = await companyOfUser();
  const menuItemService = new MenuItemService();

  if (await isAdmin()) {
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