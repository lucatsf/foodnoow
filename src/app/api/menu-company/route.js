import { Company } from "@/models/Company";
import CategoryService from "@/services/CategoryService";
import CompanyService from "@/services/CompanyService";
import MenuItemService from "@/services/MenuItemService";

export async function GET(req) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  const dbCompany = new CompanyService();

  if (slug) {
    const dbCategory = new CategoryService();
    const dbMenuItem = new MenuItemService();
    
    const company = await dbCompany.findBySlug(slug);
    const categories = await dbCategory.find({company_id: company.id});
    const menuItems = await dbMenuItem.find({company_id: company.id});
    return Response.json({company, categories, menuItems});
  }
  
  const companies = await dbCompany.getAll();
  return Response.json(companies);
}