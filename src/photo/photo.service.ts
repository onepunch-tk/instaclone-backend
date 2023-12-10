import { Injectable } from '@nestjs/common';
import { User } from '../common/models/user.model';
import { UploadPhotoInput } from './dto/input/upload-photo.input';
import { PhotoResponse } from './dto/response/photo.response';
import { PrismaRepository } from '../repositories/prisma.repository';

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaRepository) {}
  async uploadPhoto(
    authUser: User,
    uploadPhotoData: UploadPhotoInput,
  ): Promise<PhotoResponse> {
    try {
      let hashtagObj: {
        where: { hashtag: string };
        create: { hashtag: string };
      }[];
      if (uploadPhotoData.caption) {
        //parse caption
        const hashtags = uploadPhotoData.caption.match(
          /#[\w!@#$%^&*()_+\[\]\-={}]+/g,
        );
        hashtagObj = hashtags.map((hashtag) => ({
          where: {
            hashtag,
          },
          create: {
            hashtag,
          },
        }));
      }

      // save the photo with the parsed hashtags
      // add the photo to the hashtags

      let file: string = '';
      if (uploadPhotoData.file) {
        // const { filename, createReadStream } = await uploadPhotoData.file;
        // const uploadFileName = `${authUser.id}$${Date.now()}$${filename}`;
        // /* local test */
        // const readStream = createReadStream();
        // const writeStream = createWriteStream(
        //   `${process.cwd()}/uploads/${uploadFileName}`,
        // );
        // readStream.pipe(writeStream);
        // delete uploadPhotoData.file;
        // file = `http://localhost:3000/static/${uploadFileName}`;
      }
      const createdPhoto = await this.prisma.photo.create({
        data: {
          file,
          caption: uploadPhotoData?.caption,
          user: {
            connect: {
              id: authUser.id,
            },
          },
          ...(hashtagObj && {
            hashtags: {
              connectOrCreate: hashtagObj,
            },
          }),
        },
        include: {
          user: true,
        },
      });
      return {
        data: { ...createdPhoto },
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
