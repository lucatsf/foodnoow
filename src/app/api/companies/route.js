import CompanyService from "@/services/CompanyService";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const service = new CompanyService();
  if (id) {
    const result = await service.find({id});
    return Response.json(result);
  }
  const result = await service.getAll();
  return Response.json(result);
}