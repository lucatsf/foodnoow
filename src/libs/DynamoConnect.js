import dynamoose from "dynamoose";

const ddb = new dynamoose.aws.ddb.DynamoDB({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_,
    secretAccessKey: process.env.AWS_SECRET_KEY_,
  },
});

dynamoose.aws.ddb.set(ddb);


export default dynamoose;

