import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  userEmail: String,
  phone: String,
  streetAddress: String,
  number: String,
  neighborhood: String,
  city: String,
  complement: String,
  cartProducts: Object,
  paid: {type: Boolean, default: false},
  company_id: {type:String, required:true},
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);