import { Company } from "@/models/Company";
import mongoose from "mongoose";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL_);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (_id) {
    const company = await Company.findById(_id);
    return Response.json(company);
  }
  const companies = await Company.find();
  return Response.json(companies);
}