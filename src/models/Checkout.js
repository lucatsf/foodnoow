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
  user_id: {
    type: String,
    index: true
  },
  client: String,
  subtotal: {
    type: Number,
    required: true
  },
  delivery: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  menuItems: {
    type: Array,
    required: true
  },
}, {
    saveUnknown: true,
    timestamps: true
});

export const Checkout = dynamoose.model('Checkout', schema);