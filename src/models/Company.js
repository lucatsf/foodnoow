import dynamoose from '@/libs/DynamoConnect';

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
  delivery: Number,
  numberOfOrders: {
    type: Number,
    default: 0
  },
  timeopen: String,
  timeclose: String
}, {
    saveUnknown: true,
    timestamps: true
});

export const Company = dynamoose.model('Company', schema);