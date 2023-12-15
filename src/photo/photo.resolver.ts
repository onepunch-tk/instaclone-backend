import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { PhotoService } from './photo.service';
import { PhotoResponse } from './dto/response/photo.response';
import { UploadPhotoInput } from './dto/input/upload-photo.input';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../common/models/user.model';
import { SeePhotoInput } from './dto/input/see-photo.input';
import { Photo } from '../common/models/photo.model';
import { Hashtag } from '../common/models/hashtag.model';
import { PhotoListResponse } from './dto/response/photo-list.resonse';
import { PhotoListInput } from './dto/input/photo-list.input';

@Roles(GuardRole.AUTH)
@Resolver(() => Photo)
export class PhotoResolver {
  constructor(private readonly photoService: PhotoService) {}

  @ResolveField(() => User)
  async user(@Parent() { userId }: Photo) {
    return this.photoService.getUserOfPhoto(userId);
  }

  @ResolveField(() => [Hashtag])
  async hashtags(@Parent() { id: photoId }: Photo) {
    return this.photoService.getHashtagsByPhotoId(photoId);
  }

  @Roles(GuardRole.PUBLIC)
  @Query(() => PhotoResponse)
  async seePhoto(@Args('seePhotoData') { id: photoId }: SeePhotoInput) {
    return this.photoService.seePhoto(photoId);
  }

  @Roles(GuardRole.PUBLIC)
  @Query(() => PhotoListResponse)
  async getPhotosByKeyword(
    @Args('photoListData') photoListData: PhotoListInput,
  ) {
    return this.photoService.getPhotosByKeyword(photoListData);
  }

  @Mutation(() => PhotoResponse)
  async uploadPhoto(
    @AuthUser() authUser: User,
    @Args('uploadPhotoData') uploadPhotoData: UploadPhotoInput,
  ) {
    return this.photoService.uploadPhoto(authUser, uploadPhotoData);
  }
}
