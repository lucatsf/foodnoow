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
    const categories = await Category.scan(search).exec();
    return categories.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }

  async find({company_id, id}) {
    let search = {};
    if(id) {
      search.id = { eq: id };
    }
    if(company_id) {
      search.company_id = { eq: company_id}
    }
    const category = await Category.scan(search).exec();
    return category[0];
  }

  async findToCompany({company_id}) {
    return await Category.scan('company_id').eq(company_id).exec();
  }
}