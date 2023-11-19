import { Company } from "@/models/Company";
import CategoryService from "@/services/CategoryService";
import MenuItemService from "@/services/MenuItemService";
import mongoose from "mongoose";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL_);

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (slug) {
    const company = await Company.findOne({slug});
    const dbCategory = new CategoryService();
    const dbMenuItem = new MenuItemService();
    
    const categories = await dbCategory.find({company_id: company._id});
    const menuItems = await dbMenuItem.find({company_id: company._id});
    return Response.json({company, categories, menuItems});
  }
  
  const companies = await Company.find();
  return Response.json(companies);
}