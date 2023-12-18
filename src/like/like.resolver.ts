import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { LikeOnPhotoResponse } from './dto/reponse/like-on-photo.response';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { LikeOnPhotoInput } from './dto/input/like-on-photo.input';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../common/models/user.model';

@Roles(GuardRole.AUTH)
@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => LikeOnPhotoResponse)
  async likeOnPhoto(
    @AuthUser() authUser: User,
    @Args('likeOnPhotoData') likeOnPhotoData: LikeOnPhotoInput,
  ): Promise<LikeOnPhotoResponse> {
    return this.likeService.likeOnPhoto(authUser, likeOnPhotoData);
  }
}
