import {model, models, Schema} from "mongoose";

const UserSchema = new Schema({
  name: {type: String},
  email: {type: String, required: true, unique: true},
  password: {type: String},
  image: {type: String},
}, {timestamps: true});

export const User = models?.User || model('User', UserSchema);
import dynamoose from '@/libs/DynamoConnect';

const schema = new dynamoose.Schema({
  id: {
    type: String,
    index: true
  },
  name: String,
  email: {
    type: String,
    index: true
  },
  password: String,
  image: String,
}, {
    saveUnknown: true,
    timestamps: true
});

export const UserT = dynamoose.model('User', schema);