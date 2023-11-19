import {model, models, Schema} from "mongoose";

const CompanySchema = new Schema({
  name: {type:String, required:true},
  cnpj: {type:String, required:true},
  phone: {type:String, required:true},
  address: {type:String, required:true},
  neighborhood: {type:String, required:true},
  number: {type:String, required:true},
  complement: {type:String, required:true},
  city: {type:String, required:true},
  state: {type:String, required:true},
  slug: {type:String, required:true},
}, {timestamps: true});

export const Company = models?.Company || model('Company', CompanySchema);
