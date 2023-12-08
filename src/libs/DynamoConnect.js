import dynamoose from "dynamoose";

// Verificar as variáveis de ambiente para AWS
if (!process.env.NEXT_AUTH_AWS_ACCESS_KEY || !process.env.NEXT_AUTH_AWS_SECRET_KEY) {
  throw new Error('Invalid/Missing AWS environment variables');
}

// Configurar a região e as credenciais para o DynamoDB
const ddbConfig = {
  region: 'us-east-2', // ou outra região conforme necessário
  credentials: {
    accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
  },
};

// Se estiver em ambiente de desenvolvimento, use o DynamoDB Local
if (process.env.NEXT_NODE_ENV === 'development') {
  ddbConfig.endpoint = process.env.NEXT_DYNAMODB_ENDPOINT; // Isso deve apontar para o DynamoDB Local
  ddbConfig.hostname = process.env.NEXT_DYNAMODB_ENDPOINT;
  ddbConfig.credentials = { // Credenciais fictícias para o DynamoDB Local
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey'
  };
}

// Inicializar a instância do DynamoDB
const ddb = new dynamoose.aws.ddb.DynamoDB(ddbConfig);

// Configurar o DynamoDB no Dynamoose
dynamoose.aws.ddb.set(ddb);

// Exportar o Dynamoose configurado
export default dynamoose;
