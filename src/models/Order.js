import dynamoose from '@/libs/DynamoConnect';

const schema = new dynamoose.Schema({
  id: {
    type: String,
    index: true
  },
  company_id: {
    type:String,
    index: true,
    required:true
  },
  userEmail: String,
  phone: String,
  streetAddress: String,
  number: String,
  neighborhood: String,
  city: String,
  complement: String,
  cartProducts: Object,
  paid: {type: Boolean, default: false},
  creditCard: {type: Boolean, default: false},
  debitCard: {type: Boolean, default: false},
  cash: {type: Boolean, default: false},
  change: Number,
  delivery: {type: Boolean, default: false},
}, {
    saveUnknown: true,
    timestamps: true
});

export const Order = dynamoose.model('Order', schema);