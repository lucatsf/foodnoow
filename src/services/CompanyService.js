const { Company } = require("@/models/Company");
import { v4 as uuidv4 } from 'uuid';

export default class CompanyService {
  constructor() {
    this.uuid = uuidv4();
  }

  async create(data) {
    return await Company.create({
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
      delivery: data.delivery,
    });
  }

  async update(data) {
    return await Company.update(data);
  }

  async delete(id) {
    Company.delete(id);
  }

  async getAll() {
    return await Company.scan().exec();
  }

  async find({id}) {
    id = id.toString();
    return await Company.scan('id').eq(id).exec();
  }

  async findBySlug(slug) {
    const result = await Company.scan('slug').eq(slug).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }
  
}