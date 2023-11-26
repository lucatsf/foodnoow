import { MenuItem } from '@/models/MenuItem';
import { v4 as uuidv4 } from 'uuid';

export default class MenuItemService {
  constructor() {
    this.uuid = uuidv4();
  }

  async create(data) {
    const id = this.uuid;
    for (const size of data.sizes) {
      size.id = uuidv4();
    }
    for (const extraIngredientPrice of data.extraIngredientPrices) {
      extraIngredientPrice.id = uuidv4();
    }
    for (const flavorPrice of data.flavorsPrices) {
      flavorPrice.id = uuidv4();
    }
    return await MenuItem.create({
      ...data,
      id
    });
  }

  async update(data) {
    for (const size of data.sizes) {
      if (!size?.id) {
        size.id = uuidv4();
      }
    }
    for (const extraIngredientPrice of data.extraIngredientPrices) {
      if (!extraIngredientPrice?.id) {
        extraIngredientPrice.id = uuidv4();
      }
    }
    for (const flavorPrice of data.flavorsPrices) {
      if (!flavorPrice?.id) {
        flavorPrice.id = uuidv4();
      }
    }
    return await MenuItem.update(data);
  }

  async delete(id) {
    MenuItem.delete(id);
  }

  async getAll({id, company_id, name}) {
    let search = {};
    if (id) {
      search.id = id;
    }
    if (company_id) {
      search.company_id = company_id;
    }
    if (name) {
      search.name = name;
    }
    return await MenuItem.scan(search).exec();
  }

  async find({company_id, id}) {
    company_id = company_id.toString()
    let search = {};
    if (id) {
      search.id = { eq: id };
    }
    if (company_id) {
      search.company_id = { eq: company_id };
    }
    const menuItem = await MenuItem.scan(search).exec();
    return menuItem[0];
  }

  async findToCompany({company_id}) {
    company_id = company_id.toString();
    return await MenuItem.scan('company_id').eq(company_id).exec();
  }
}