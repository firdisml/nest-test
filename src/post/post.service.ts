import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PostService {
  async uploadPublicFile(dataBuffer: Buffer) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: 'bucketfirdaus',
          Body: dataBuffer,
          Key: `${uuid()}.jpg`,
        })
        .promise();

      return {
        key: uploadResult.Key,
        url: uploadResult.Location,
      };
    } catch (err) {
      console.log(err);
      return { key: 'error', url: err.message };
    }
  }
}
