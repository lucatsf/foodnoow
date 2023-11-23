import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import MenuItemService from "@/services/MenuItemService";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function POST(req) {
  await checkLimiter(req);
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
    return response(result, {req})
  } else {
    return response(true, {req})
  }
}

export async function PUT(req) {
  await checkLimiter(req);
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
    return response(result, {req})
  }
  return response(true, {req})
}

export async function GET(req) {
  await checkLimiter(req);
  const companyId = await companyOfUser();
  const menuItemService = new MenuItemService();

  if (await isAdmin()) {
    const result = await menuItemService.getAll({ company_id: companyId});
    return response(result, {req})
  }
  const result = await menuItemService.getAll();
  return response(result, {req})
}

export async function DELETE(req) {
  await checkLimiter(req);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (await isAdmin()) {
    const menuItemService = new MenuItemService();
    await menuItemService.delete(id);
    return response(true, {req})
  }
  return response(true, {req})
}