import { authOptions } from "@/libs/auth";
import { getValuesObject } from "@/libs/getValuesObject";
import UserInfoService from "@/services/UserInfoService";
import UserService from "@/services/UserService";
import {getServerSession} from "next-auth";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function PUT(req) {
  await checkLimiter(req);

  const data = await req.json();
  const {id, name, image, ...otherUserInfo} = data;

  if (!name || name === '') {
    throw new Error('O nome é obrigatório');
  }
  if (!data?.streetAddress || data?.streetAddress === '') {
    throw new Error('O endereço é obrigatório');
  }
  if (!data?.number || data?.number === '') {
    throw new Error('O número é obrigatório');
  }
  if (!data?.neighborhood || data?.neighborhood === '') {
    throw new Error('O bairro é obrigatório');
  }
  if (!data?.city || data?.city === '') {
    throw new Error('A cidade é obrigatória');
  }
  if (!data?.phone || data?.phone === '') {
    throw new Error('O telefone é obrigatório');
  }
  if(!data?.complement || data?.complement === '') {
    throw new Error('O complemento é obrigatório');
  }

  let filter = {};
  if (id) {
    filter = {id};
  } else {
    const session = await getServerSession(authOptions);
    const email = session.user.email;
    filter = {email};
  }
  const userInfoService = new UserInfoService();
  const userService = new UserService();
  const user = await userService.find(filter);
  await userService.update({id: user.id, name, image});
  const userInfo = getValuesObject({...otherUserInfo, email:user.email});
  await userInfoService.update({
    ...userInfo, email:user.email,
  });

  return response(true, {req})
}

export async function GET(req) {
  await checkLimiter(req);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  let filterUser = {};
  if (id) {
    filterUser = {id};
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return response(false, {req})
    }
    filterUser = {email};
  }
  const userInfoService = new UserInfoService();
  const userService = new UserService();

  const user = await userService.find(filterUser);
  const userInfo = await userInfoService.find({email:user.email});

  return response({...user, ...userInfo}, {req});

}