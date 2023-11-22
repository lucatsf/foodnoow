import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';

export async function POST(req) {
  const data =  await req.formData();
  if (data.get('file')) {
    const file = data.get('file');

    const s3Client = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_,
        secretAccessKey: process.env.AWS_SECRET_KEY_,
      },
    });

    const ext = file.name.split('.').slice(-1)[0];
    const newFileName = uuid() + '.' + ext;

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const bucket = process.env.BUCKET_;

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
    return Response.json(link);
  }
  return Response.json(true);
}