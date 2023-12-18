import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { User } from '../common/models/user.model';
import { LikeOnPhotoInput } from './dto/input/like-on-photo.input';
import { LikeOnPhotoResponse } from './dto/reponse/like-on-photo.response';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaRepository) {}
  async likeOnPhoto(
    authUser: User,
    { id: photoId }: LikeOnPhotoInput,
  ): Promise<LikeOnPhotoResponse> {
    try {
      const findPhoto = await this.prisma.photo.findUnique({
        where: { id: photoId },
      });
      if (!findPhoto) {
        throw new ForbiddenException('not found photo.');
      }

      const likeWhere = {
        userId_photoId: {
          userId: authUser.id,
          photoId: photoId,
        },
      };

      const findLike = await this.prisma.like.findUnique({
        where: likeWhere,
      });

      if (findLike) {
        //unlike
        await this.prisma.like.delete({
          where: likeWhere,
        });
      } else {
        //like
        await this.prisma.like.create({
          data: {
            user: {
              connect: {
                id: authUser.id,
              },
            },
            photo: {
              connect: {
                id: photoId,
              },
            },
          },
        });
      }

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
}
