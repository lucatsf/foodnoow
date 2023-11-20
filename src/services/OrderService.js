import { Order } from '@/models/Order';
import { v4 as uuidv4 } from 'uuid';

export default class OrderService {
  constructor() {
    this.dbOrder = Order;
    this.uuid = uuidv4();
  }

  async create(order) {
    const newOrder = new this.dbOrder(order);
    return await newOrder.save();
  }

  async find({id, userEmail, company_id}) {
    let search = {}
    if (id) {
      search.id = { eq: id };
    }
    if (userEmail) {
      search.userEmail = { eq: userEmail };
    }
    if (company_id) {
      search.company_id = { eq: company_id };
    }
    const result = await this.dbOrder.scan(search).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async findAll({id, userEmail, company_id}) {
    let search = {}
    if (id) {
      search.id = { eq: id };
    }
    if (userEmail) {
      search.userEmail = { eq: userEmail };
    }
    if (company_id) {
      search.company_id = { eq: company_id };
    }
    return await this.dbOrder.scan(search).exec();
  }
}