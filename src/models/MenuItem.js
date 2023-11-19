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
  image: String,
  name: String,
  description: String,
  category: String,
  basePrice: Number,
  sizes: Array,
  extraIngredientPrices: Array,
}, {
    saveUnknown: true,
    timestamps: true
});

export const MenuItem = dynamoose.model('MenuItem', schema);