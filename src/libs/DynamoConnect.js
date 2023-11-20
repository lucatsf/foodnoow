// Importar o Dynamoose
import dynamoose from "dynamoose";

// Verificar as variáveis de ambiente para AWS
if (!process.env.AWS_ACCESS_KEY_ || !process.env.AWS_SECRET_KEY_) {
  throw new Error('Invalid/Missing AWS environment variables');
}

// Configurar a região e as credenciais para o DynamoDB
const ddbConfig = {
  region: 'us-east-2', // ou outra região conforme necessário
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_,
    secretAccessKey: process.env.AWS_SECRET_KEY_,
  },
};

// Inicializar a instância do DynamoDB
const ddb = new dynamoose.aws.ddb.DynamoDB(ddbConfig);

// Configurar o DynamoDB no Dynamoose
dynamoose.aws.ddb.set(ddb);

// Exportar o Dynamoose configurado
export default dynamoose;
