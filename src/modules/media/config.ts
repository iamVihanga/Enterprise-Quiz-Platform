import * as AWS from "@aws-sdk/client-s3";

export const s3Config = {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
  baseUrl: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`,
};

// Singleton S3 client instance
export const s3Client = new AWS.S3({
  region: s3Config.region,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});
