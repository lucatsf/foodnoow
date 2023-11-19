const { CompanyT } = require("@/models/Company");
import { v4 as uuidv4 } from 'uuid';

export default class CompanyService {
  constructor() {
    this.dbCategory = CompanyT;
    this.uuid = uuidv4();
  }

  async create(data) {
    return await CompanyT.create({
      id: this.uuid,
      name: data.name,
      slug: data.slug,
      image: data.image,
      cnpj: data.cnpj,
      phone: data.phone,
      address: data.address,
      neighborhood: data.neighborhood,
      number: data.number,
      complement: data.complement,
      city: data.city,
      state: data.state,
    });
  }

  async update(data) {
    return await CompanyT.update(data);
  }

  async delete(id) {
    CompanyT.delete(id);
  }

  async getAll() {
    return await CompanyT.scan().exec();
  }

  async find({id}) {
    id = id.toString();
    return await CompanyT.scan('id').eq(id).exec();
  }

  async findBySlug(slug) {
    const result = await CompanyT.scan('slug').eq(slug).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }
  
}