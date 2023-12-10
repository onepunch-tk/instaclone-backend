import { BadRequestException, Injectable } from '@nestjs/common';
import { SignedUrlInput } from './dto/input/signed-url.input';
import AWS from 'aws-sdk';
import { SignedUrlResponse } from './dto/response/signed-url.response';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private MAX_FILE_SIZE = 2 * 1024 * 1024;
  //SignedUrl 만료 시간 1시간
  private EXPIRES_IN_HOURS = 60 * 60;
  async getSignedUrl(
    signedUrlData: SignedUrlInput,
  ): Promise<SignedUrlResponse> {
    try {
      const { fileName, fileSize, contentType } = signedUrlData;
      if (fileSize > this.MAX_FILE_SIZE) {
        throw new BadRequestException('File size exceeds maximum limit');
      }

      const expirationDate = new Date();
      expirationDate.setHours(
        expirationDate.getHours() + this.EXPIRES_IN_HOURS,
      );

      const params: AWS.S3.Types.PutObjectRequest = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: fileName,
        Expires: expirationDate,
        ContentType: contentType,
      };

      const signedUrl = await this.s3.getSignedUrlPromise('putObject', params);

      return {
        data: { signedUrl },
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }
}
