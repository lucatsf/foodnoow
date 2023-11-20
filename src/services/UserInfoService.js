import { UserInfo } from "@/models/UserInfo";
import { v4 as uuidv4 } from 'uuid';

export default class UserInfoService {
  constructor() {
    this.uuid = uuidv4();
  }

  async create(data) {
    return await UserInfo.create({
      ...data,
      id: this.uuid,
    });
  }

  async update(data) {
    if (data?.email) {
      const info = await UserInfo.scan({email: {eq: data.email}}).exec();
      if (info.length <= 0) {
        data.id = this.uuid;
        return await UserInfo.create(data);
      }
      return await UserInfo.update({...data, id: info[0]?.id});
    }
    return null;
  }

  async delete(id) {
    UserInfo.delete(id);
  }

  async getAll() {
    return await UserInfo.scan().exec();
  }

  async find({email, id}) {
    let search = {};
    if (email) {
      search.email = { eq: email };
    }
    if (id) {
      search.id = { eq: id };
    }
    const result = await UserInfo.scan(search).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async findById(id) {
    return await UserInfo.get(id);
  }
}