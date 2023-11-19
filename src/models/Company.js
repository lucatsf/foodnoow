import {model, models, Schema} from "mongoose";
import dynamoose from '@/libs/DynamoConnect';

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
  image: {type:String, required:true},
}, {timestamps: true});

export const Company = models?.Company || model('Company', CompanySchema);

const schema = new dynamoose.Schema({
  id: {
    type: String,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    index: true
  },
  image: String,
  cnpj: {
    type: String,
    required: true,
    index: true
  },
  phone: String,
  address: String,
  neighborhood: String,
  number: String,
  complement: String,
  city: String,
  state: String,
}, {
    saveUnknown: true,
    timestamps: true
});

export const CompanyT = dynamoose.model('Company', schema);