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
    if (data?.email) {
      const info = await UserInfoT.scan({email: {eq: data.email}}).exec();
      if (info.length <= 0) {
        data.id = this.uuid;
        return await UserInfoT.create(data);
      }
      return await UserInfoT.update({...data, id: info[0]?.id});
    }
    return null;
  }

  async delete(id) {
    UserInfoT.delete(id);
  }

  async getAll() {
    return await UserInfoT.scan().exec();
  }

  async find({email, id}) {
    let search = {};
    if (email) {
      search.email = { eq: email };
    }
    if (id) {
      search.id = { eq: id };
    }
    const result = await UserInfoT.scan(search).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async findById(id) {
    return await UserInfoT.get(id);
  }
}