import { Category } from "@/models/Category";
import { Company } from "@/models/Company";
import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL_);

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (slug) {
    const company = await Company.findOne({slug});
    const categories = await Category.find({company_id: company._id});
    const menuItems = await MenuItem.find({company_id: company._id});
    return Response.json({company, categories, menuItems});
  }
  
  const companies = await Company.find();
  return Response.json(companies);
}