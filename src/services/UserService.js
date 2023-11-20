import { UserT } from "@/models/User";
import { v4 as uuidv4 } from 'uuid';

export default class UserService {
  constructor() {
    this.dbCategory = UserT;
    this.uuid = uuidv4();
  }

  async create(data) {
    return await UserT.create({
      id: this.uuid,
      name: data.name,
      email: data.email,
      password: data.password,
      image: data.image,
    });
  }

  async update(data) {
    return await UserT.update(data);
  }

  async delete(id) {
    UserT.delete(id);
  }

  async getAll() {
    return await UserT.scan().exec();
  }

  async find({email}) {
    const result = await UserT.scan('email').eq(email).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async findById(id) {
    return await UserT.get(id);
  }
}