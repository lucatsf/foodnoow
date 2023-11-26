import bcrypt from "bcrypt";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";
import UserService from "@/services/UserService";

export async function POST(req) {
  await checkLimiter(req);
  const body = await req.json();
  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    throw new Error('A senha deve ter no mínimo 5 caracteres');
  }
  if (!body?.email || body?.email === '') {
    throw new Error('O email é obrigatório');
  }
  if (!body?.name || body?.name === '') {
    throw new Error('O nome é obrigatório');
  }
  const userService = new UserService();
  const userExists = await userService.find({email: body.email});
  if (userExists) {
    throw new Error('Este email já está cadastrado');
  }
  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);
  const createdUser = await userService.create(body);
  return response(createdUser, {req});
}