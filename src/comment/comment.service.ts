import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { User } from '../common/models/user.model';
import { CreateCommentInput } from './dto/input/create-comment.input';
import { CreateCommentResponse } from './dto/response/create-comment.response';
import { GetCommentsInput } from './dto/input/get-comments.input';
import { GetCommentsResponse } from './dto/response/get-comments.response';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaRepository) {}

  async createComment(
    authUser: User,
    { photoId, payload }: CreateCommentInput,
  ): Promise<CreateCommentResponse> {
    try {
      const findPhoto = await this.prisma.photo.findUnique({
        where: { id: photoId },
        select: {
          id: true,
        },
      });

      if (!findPhoto) {
        throw new ForbiddenException('not found photo.');
      }

      await this.prisma.comment.create({
        data: {
          payload,
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

  async getCommentsByPhotoId({
    photoId,
    pageSize,
    afterId,
  }: GetCommentsInput): Promise<GetCommentsResponse> {
    try {
      const findPhoto = await this.prisma.photo.findUnique({
        where: { id: photoId },
        select: {
          id: true,
        },
      });

      if (!findPhoto) {
        throw new ForbiddenError('not found photo.');
      }

      const comments = await this.prisma.comment.findMany({
        where: {
          photoId,
        },
        take: pageSize,
        skip: afterId ? 1 : 0,
        ...(afterId && { cursor: { id: afterId } }),
      });
      return {
        data: comments,
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
