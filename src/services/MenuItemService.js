import { MenuItem } from '@/models/MenuItem';
import { v4 as uuidv4 } from 'uuid';

export default class MenuItemService {
  constructor() {
    this.dbMenuItem = MenuItem;
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

  async getAll() {
    return await MenuItem.scan().exec();
  }

  async delete(id) {
    MenuItem.delete(id);
  }
}