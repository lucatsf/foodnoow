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

import dynamoose from '@/libs/DynamoConnect';

const schema = new dynamoose.Schema({
  id: {
    type: String,
    index: true
  },
  company_id: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true
  },
  streetAddress: String,
  number: String,
  neighborhood: String,
  city: String,
  complement: String,
  phone: String,
  admin: {type: Boolean, default: false},
  root: {type: Boolean, default: false},
}, {
    saveUnknown: true,
    timestamps: true
});

export const UserInfoT = dynamoose.model('User', schema);