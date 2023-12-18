import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { GetFollowInput } from './dto/input/get-follow.input';
import { GetFollowResponse } from './dto/reponse/get-follow.response';
import { User } from '../common/models/user.model';
import { FollowInput } from './dto/input/follow.input';
import { FollowResponse } from './dto/reponse/follow.response';
import { FollowRole } from '../constants/role.enum';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaRepository) {}

  async getFollow(getFollowData: GetFollowInput): Promise<GetFollowResponse> {
    try {
      const { username, role, afterId, pageSize } = getFollowData;
      const findUser = await this.prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
        },
      });

      if (!findUser) {
        throw new ForbiddenException('not found user.');
      }

      const response: GetFollowResponse = { data: { id: findUser.id } };

      switch (role) {
        case FollowRole.ALL_FOLLOW:
          response.data = {
            ...response.data,
            followedBy: await this.followedBy(findUser.id, afterId, pageSize),
            following: await this.following(findUser.id, afterId, pageSize),
          };
          break;
        case FollowRole.FOLLOWED_BY:
          response.data = {
            ...response.data,
            followedBy: await this.followedBy(findUser.id, afterId, pageSize),
          };
          break;
        case FollowRole.FOLLOWING:
          response.data = {
            ...response.data,
            following: await this.following(findUser.id, afterId, pageSize),
          };
          break;
      }

      return response;
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }

  async follow(
    authUser: User,
    { username, role }: FollowInput,
  ): Promise<FollowResponse> {
    try {
      if (authUser.username === username) {
        throw new Error(
          'Following oneself is a paradox. Please follow others.',
        );
      }
      const toUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!toUser) {
        throw new ForbiddenException('not fount follow/unfollow user');
      }
      await this.prisma.user.update({
        where: { id: authUser.id },
        data: {
          following: {
            ...(role === FollowRole.UN_FOLLOW
              ? { disconnect: { id: toUser.id } }
              : { connect: { id: toUser.id } }),
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

  async getIsFollowing(followingId: number, id: number) {
    const exists = await this.prisma.user
      .findUnique({ where: { id } })
      .following({ where: { id: followingId } });
    return exists.length !== 0;
  }

  async followedBy(searchId: number, afterId: number, pageSize: number) {
    return this.prisma.user
      .findUnique({
        where: {
          id: searchId,
        },
      })
      .followedBy({
        take: pageSize,
        skip: afterId ? 1 : 0,
        ...(afterId && { cursor: { id: afterId } }),
      });
  }

  async following(searchId: number, afterId: number, pageSize: number) {
    return this.prisma.user
      .findUnique({
        where: {
          id: searchId,
        },
      })
      .following({
        take: pageSize,
        skip: afterId ? 1 : 0,
        ...(afterId && { cursor: { id: afterId } }),
      });
  }

  async followedByCount(userId: number): Promise<number> {
    return this.prisma.user.count({
      where: { following: { some: { id: userId } } },
    });
  }

  async followingCount(userId: number): Promise<number> {
    return this.prisma.user.count({
      where: { followedBy: { some: { id: userId } } },
    });
  }
}
