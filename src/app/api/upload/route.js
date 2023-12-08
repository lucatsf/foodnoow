import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { userAuth } from "../auth/[...nextauth]/route";
import { checkLimiter } from "../config/limiter";
import { response } from "@/libs/response";

export async function POST(req) {
  await checkLimiter(req);
  const data = await req.formData();
  if (data.get('file')) {
    const user = await userAuth();
    const local = data.get('local');
    const file = data.get('file');
    const companyName = user?.company?.name ? user?.company?.name.toLowerCase().replace(' ', '-') : false;
    const companyFolder = companyName ? `${companyName}/${local}` : '';
    let folder = user?.company?.name ? companyFolder : local;
    const s3Client = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
      },
    });

    const ext = file.name.split('.').pop();

    if (process.env.NEXT_NODE_ENV === 'development') {
      folder = `dev/${folder}`
    }

    const newFileName = `${folder}/${uuid()}.${ext}`;

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const bucket = process.env.NEXT_BUCKET;

    const resized = await sharp(buffer)
      .resize(500, 500)
      .toBuffer();

    await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: newFileName,
      ACL: 'public-read',
      ContentType: file.type,
      Body: resized,
    }));

    const link = `https://${bucket}.s3.amazonaws.com/${newFileName}`;
    return response(link, { req });
  }
  throw new Error('Você não tem permissão para realizar esta ação');
}
