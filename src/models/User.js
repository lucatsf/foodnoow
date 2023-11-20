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

export const User = dynamoose.model('User', schema);