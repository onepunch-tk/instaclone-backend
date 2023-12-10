import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { SeeFollowInput } from './dto/input/see-follow.input';
import { SeeFollowResponse } from './dto/reponse/see-follow.response';
import { User } from '../common/models/user.model';
import { FollowInput } from './dto/input/follow.input';
import { FollowResponse } from './dto/reponse/follow.response';
import { FollowRole, SeeFollowRole } from '../constants/role.enum';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaRepository) {}
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
  async followedBy(searchId: number, afterId: number) {
    return this.prisma.user
      .findUnique({
        where: {
          id: searchId,
        },
      })
      .followedBy({
        take: 5,
        skip: afterId ? 1 : 0,
        ...(afterId && { cursor: { id: afterId } }),
      });
  }

  async following(searchId: number, afterId: number) {
    return this.prisma.user
      .findUnique({
        where: {
          id: searchId,
        },
      })
      .following({
        take: 10,
        skip: afterId ? 1 : 0,
        ...(afterId && { cursor: { id: afterId } }),
      });
  }
  async seeFollow(seeFollowData: SeeFollowInput): Promise<SeeFollowResponse> {
    try {
      const { username, afterId, role } = seeFollowData;
      const findUser = await this.prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
        },
      });

      if (!findUser) {
        throw new ForbiddenException('not found user.');
      }

      const response: SeeFollowResponse = { data: { id: findUser.id } };

      switch (role) {
        case SeeFollowRole.ALL_FOLLOW:
          response.data = {
            ...response.data,
            followedBy: await this.followedBy(findUser.id, afterId),
            following: await this.following(findUser.id, afterId),
          };
          break;
        case SeeFollowRole.FOLLOWED_BY:
          response.data = {
            ...response.data,
            followedBy: await this.followedBy(findUser.id, afterId),
          };
          break;
        case SeeFollowRole.FOLLOWING:
          response.data = {
            ...response.data,
            following: await this.following(findUser.id, afterId),
          };
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
            ...(role === FollowRole.FOLLOW
              ? { connect: { id: toUser.id } }
              : { disconnect: { id: toUser.id } }),
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
}
