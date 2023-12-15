import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../common/models/user.model';
import { UploadPhotoInput } from './dto/input/upload-photo.input';
import { PhotoResponse } from './dto/response/photo.response';
import { PrismaRepository } from '../repositories/prisma.repository';
import { PhotoListInput } from './dto/input/photo-list.input';
import { PhotoListResponse } from './dto/response/photo-list.resonse';

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

  async seePhoto(photoId: number): Promise<PhotoResponse> {
    try {
      const findPhoto = await this.prisma.photo.findUnique({
        where: { id: photoId },
      });

      if (!findPhoto) {
        throw new ForbiddenException(`not found photo by photoId:${photoId}`);
      }
      return {
        data: { ...findPhoto },
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }

  async getPhotosByKeyword({
    keyword,
    pageSize,
    afterId,
  }: PhotoListInput): Promise<PhotoListResponse> {
    try {
      const photos = await this.prisma.photo.findMany({
        where: {
          caption: {
            startsWith: keyword,
          },
        },
        take: pageSize,
        skip: afterId ? 1 : 0,
        ...(afterId && { cursor: { id: afterId } }),
      });
      console.log(photos);
      return {
        data: photos,
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }

  async getUserOfPhoto(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  getHashtagsByPhotoId(photoId: number) {
    return this.prisma.hashtag.findMany({
      where: {
        photos: {
          some: {
            id: photoId,
          },
        },
      },
    });
  }
}
