import CategoryService from "@/services/CategoryService";
import CompanyService from "@/services/CompanyService";
import MenuItemService from "@/services/MenuItemService";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function GET(req) {
  await checkLimiter(req);
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  const dbCompany = new CompanyService();

  if (slug) {
    const dbCategory = new CategoryService();
    const dbMenuItem = new MenuItemService();
    
    const company = await dbCompany.findBySlug(slug);
    const categories = await dbCategory.findToCompany({company_id: company.id});
    const menuItems = await dbMenuItem.findToCompany({company_id: company.id});
    return response({company, categories, menuItems}, {req})
  }
  
  const companies = await dbCompany.getAll();
  return response(companies, {req})
}