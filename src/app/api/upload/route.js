import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { isAdmin } from "../auth/[...nextauth]/route";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function POST(req) {
  await checkLimiter(req);
  const data =  await req.formData();
  if (data.get('file')) {
    const file = data.get('file');
    if (await isAdmin()) {
      const s3Client = new S3Client({
        region: 'us-east-2',
        credentials: {
          accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
          secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
        },
      });

      const ext = file.name.split('.').slice(-1)[0];
      const newFileName = uuid() + '.' + ext;

      const chunks = [];
      for await (const chunk of file.stream()) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      const bucket = process.env.NEXT_BUCKET;

      const rezied = await sharp(buffer)
      .resize(500, 500)
      .toBuffer();

      await s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: newFileName,
        ACL: 'public-read',
        ContentType: file.type,
        Body: rezied,
      }));


      const link = 'https://'+bucket+'.s3.amazonaws.com/'+newFileName;
      return response(link, {req});
    }
    throw new Error('Você não tem permissão para realizar esta ação');
  }
  return response(true, {req});
}