import { MenuItem } from '@/models/MenuItem';
import { v4 as uuidv4 } from 'uuid';

export default class MenuItemService {
  constructor() {
    this.uuid = uuidv4();
  }

  async create(data) {
    const id = this.uuid;
    return await MenuItem.create({
      ...data,
      id
    });
  }

  async update(data) {
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

  async find({company_id}) {
    company_id = company_id.toString();
    return await MenuItem.scan('company_id').eq(company_id).exec();
  }
}