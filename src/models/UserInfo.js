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

export const UserInfo = dynamoose.model('UserInfo', schema);