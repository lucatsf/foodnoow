import {model, models, Schema} from "mongoose";

const UserInfoSchema = new Schema({
  email: {type: String, required: true},
  streetAddress: {type: String},
  number: {type: String},
  neighborhood: {type: String},
  city: {type: String},
  complement: {type: String},
  phone: {type: String},
  admin: {type: Boolean, default: false},
  root: {type: Boolean, default: false},
  company_id: {type: String, required: true},
}, {timestamps: true});

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema);