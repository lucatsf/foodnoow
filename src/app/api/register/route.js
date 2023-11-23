import {User} from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function POST(req) {
  await checkLimiter(req);
  const body = await req.json();
  mongoose.connect(process.env.MONGO_URL_);
  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    new Error('A senha deve ter no mínimo 5 caracteres');
  }
  if (!body?.email || body?.email === '') {
    new Error('O email é obrigatório');
  }

  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await User.create(body);
  return response(createdUser, {req});
}