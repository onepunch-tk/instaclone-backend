import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { PhotoLikesUserListResponse } from './dto/response/photo-likes-user-list.response';
import { PaginationInput } from '../common/dto/input/pagination.input';
import { Photo } from '../common/models/photo.model';
import { DeletePhotoResponse } from './dto/response/delete-photo.response';

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
        connectHashtags = hashtagParse(uploadPhotoData.caption);
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
            ...(connectHashtags && { create: connectHashtags }),
          },
        },
      });

      // hashtags: {
      // ...(connectHashtags && {
      //     create: connectHashtags,
      //   }),
      // },
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

  async getPhotoLikesUsers(
    photoId: number,
  ): Promise<PhotoLikesUserListResponse> {
    try {
      const findLikes = await this.prisma.like.findMany({
        where: {
          photoId,
        },
        select: {
          user: {
            select: {
              username: true,
              id: true,
              avatar: true,
            },
          },
        },
      });
      return {
        data: findLikes.map((like) => like.user),
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
      });
      if (!findPhoto) {
        throw new ForbiddenException('not found photo.');
      }

      // 기존 해시태그 연결 해제 (HashtagsOnPhotos 레코드 삭제)
      await this.prisma.hashtagsOnPhotos.deleteMany({
        where: {
          photoId: id,
        },
      });

      const connectHashtags = hashtagParse(caption);
      const updatedPhoto = await this.prisma.photo.update({
        where: { id },
        data: {
          caption,
          hashtags: {
            ...(connectHashtags && {
              create: connectHashtags,
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
  }

  async deletePhoto(
    authUserId: number,
    photoId: number,
  ): Promise<DeletePhotoResponse> {
    try {
      const deletePhoto = await this.prisma.photo.findUnique({
        where: { id: photoId },
      });

      if (!deletePhoto) {
        throw new ForbiddenException('not found photo.');
      }

      if (authUserId !== deletePhoto.userId) {
        throw new UnauthorizedException();
      }

      await this.prisma.photo.delete({ where: { id: photoId } });
      return {
        data: { success: true },
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }

  async getFeeds(
    authUser: User,
    { afterId, pageSize }: PaginationInput,
  ): Promise<PhotoListResponse> {
    try {
      const findFeeds = await this.prisma.photo.findMany({
        take: pageSize,
        skip: afterId ? 1 : 0,
        ...(afterId && { cursor: { id: afterId } }),
        where: {
          OR: [
            {
              user: {
                followedBy: {
                  some: {
                    id: authUser.id,
                  },
                },
              },
            },
            {
              userId: authUser.id,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        data: findFeeds,
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

  async getLikes(photoId: number) {
    return this.prisma.like.count({
      where: {
        photoId,
      },
    });
  }

  async getComments(photoId: number) {
    return this.prisma.comment.count({
      where: {
        photoId,
      },
    });
  }

  async getPhotosByUserIds(
    userIds: number[],
    { afterId, pageSize }: PaginationInput,
  ): Promise<Photo[]> {
    return this.prisma.photo.findMany({
      where: {
        userId: { in: userIds },
      },
      take: pageSize,
      skip: afterId ? 1 : 0,
      ...(afterId && { cursor: { id: afterId } }),
    });
  }

  async getHashtagsByPhotoIds(photoIds: number[]) {
    return this.prisma.hashtag.findMany({
      where: {
        photos: {
          some: {
            photoId: {
              in: photoIds,
            },
          },
        },
      },
      include: {
        photos: {
          select: {
            photoId: true,
          },
        },
      },
    });
  }
}
