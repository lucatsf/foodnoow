import { Category } from "@/models/Category";
import { v4 as uuidv4 } from 'uuid';

export default class CategoryService {
  constructor() {
    this.dbCategory = Category;
    this.uuid = uuidv4();
  }

  async create(data) {
    return await Category.create({
      id: this.uuid,
      name: data.name,
      company_id: data.company_id
    });
  }

  async update(data) {
    return await Category.update(data);
  }

  async delete(id) {
    Category.delete(id);
  }

  async getAll() {
    return await Category.scan().exec();
  }

  async find({company_id}) {
    return await Category.scan('company_id').eq(company_id).exec();
  }
}