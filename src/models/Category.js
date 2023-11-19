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
  name: String,
}, {
    saveUnknown: true,
    timestamps: true
});

export const Category = dynamoose.model('Category', schema);