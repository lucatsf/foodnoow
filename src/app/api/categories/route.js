import {companyOfUser, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Category} from "@/models/Category";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL_);
  const {name} = await req.json();
  if (await isAdmin()) {
    const company_id = await companyOfUser();
    const categoryDoc = await Category.create({name, company_id});
    return Response.json(categoryDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL_);
  const {_id, name} = await req.json();
  if (await isAdmin()) {
    const company_id = await companyOfUser();
    await Category.updateOne({_id}, {name, company_id});
  }
  return Response.json(true);
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL_);
  return Response.json(
    await Category.find()
  );
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL_);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Category.deleteOne({_id});
  }
  return Response.json(true);
}