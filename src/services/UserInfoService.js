import { UserInfoT } from "@/models/UserInfo";
import { v4 as uuidv4 } from 'uuid';

export default class UserInfoService {
  constructor() {
    this.dbCategory = UserInfoT;
    this.uuid = uuidv4();
  }

  async create(data) {
    return await UserInfoT.create({
      ...data,
      id: this.uuid,
    });
  }

  async update(data) {
    return await UserInfoT.update(data);
  }

  async delete(id) {
    UserInfoT.delete(id);
  }

  async getAll() {
    return await UserInfoT.scan().exec();
  }

  async find({email}) {
    const result = await UserInfoT.scan('email').eq(email).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async findById(id) {
    return await UserInfoT.get(id);
  }
}