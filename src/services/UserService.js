import { User } from "@/models/User";
import { v4 as uuidv4 } from 'uuid';
import UserInfoService from "./UserInfoService";

export default class UserService {
  constructor() {
    this.uuid = uuidv4();
  }

  async create(data) {
    return await User.create({
      id: this.uuid,
      name: data?.name,
      email: data?.email,
      password: data?.password,
      image: data?.image,
    });
  }

  async update(data) {
    return await User.update(data);
  }

  async delete(id) {
    User.delete(id);
  }

  async getAll({email, id, company_id}) {
    let search = {};
    if (email) {
      search.email = { eq: email };
    }
    if (id) {
      search.id = { eq: id };
    }
    if (company_id) {
      const userInfoService = new UserInfoService();
      const infos = await userInfoService.getAll({company_id});
      const emails = infos.map(info => info.email);
      const result = await User.scan({email: { in: emails }}).exec();
      return result;
    }
    return await User.scan(search).exec();
  }

  async find({email, id}) {
    let search = {};
    if (email) {
      search.email = { eq: email };
    }
    if (id) {
      search.id = { eq: id };
    }
    const result = await User.scan(search).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async findById(id) {
    return await User.get(id);
  }
}