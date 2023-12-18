import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../common/models/user.model';
import { UploadPhotoInput } from './dto/input/upload-photo.input';
import { PhotoResponse } from './dto/response/photo.response';
import { PrismaRepository } from '../repositories/prisma.repository';
import { GetPhotoListInput } from './dto/input/get-photo-list.input';
import { PhotoListResponse } from './dto/response/photo-list.resonse';
import { EditPhotoInput } from './dto/input/edit-photo.input';
import {
  CreateOrConnectHashtag,
  hashtagParse,
} from './utils/hashtag-parse.util';

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaRepository) {}
  async uploadPhoto(
    authUser: User,
    uploadPhotoData: UploadPhotoInput,
  ): Promise<PhotoResponse> {
    try {
      let connectHashtags: CreateOrConnectHashtag[] = null;
      if (uploadPhotoData.caption) {
        console.log(uploadPhotoData.caption);
        connectHashtags = hashtagParse(uploadPhotoData.caption);
        console.log(connectHashtags);
      }

      const file: string = '';
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
          hashtags: {
            ...(connectHashtags && {
              connectOrCreate: connectHashtags,
            }),
          },
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

  async getPhotoById(photoId: number): Promise<PhotoResponse> {
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
  }: GetPhotoListInput): Promise<PhotoListResponse> {
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

  async editPhoto(
    authUser: User,
    { id, caption }: EditPhotoInput,
  ): Promise<PhotoResponse> {
    try {
      const findPhoto = await this.prisma.photo.findUnique({
        where: {
          id,
          userId: authUser.id,
        },
        include: {
          hashtags: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!findPhoto) {
        throw new ForbiddenException('not found photo.');
      }
      const disconnectHashtags = findPhoto.hashtags.map((hashtag) => ({
        id: hashtag.id, // 해시태그의 고유 ID를 사용
      }));
      const connectHashtags = hashtagParse(caption);
      const updatedPhoto = await this.prisma.photo.update({
        where: { id },
        data: {
          caption,
          hashtags: {
            ...(disconnectHashtags && { disconnect: disconnectHashtags }),
            ...(connectHashtags && {
              connectOrCreate: connectHashtags,
            }),
          },
        },
      });
      return {
        data: { ...updatedPhoto },
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
    return Promise.resolve(undefined);
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
