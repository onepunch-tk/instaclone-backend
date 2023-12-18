import {
  Args,
  Int,
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
import { GetPhotoInput } from './dto/input/get-photo.input';
import { Photo } from '../common/models/photo.model';
import { Hashtag } from '../common/models/hashtag.model';
import { PhotoListResponse } from './dto/response/photo-list.resonse';
import { GetPhotoListInput } from './dto/input/get-photo-list.input';
import { EditPhotoInput } from './dto/input/edit-photo.input';
import { PhotoLikesUserListResponse } from './dto/response/photo-likes-user-list.response';

@Roles(GuardRole.PUBLIC)
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

  @ResolveField(() => Int)
  async likes(@Parent() { id: photoId }: Photo) {
    return this.photoService.getLikes(photoId);
  }

  @Query(() => PhotoResponse)
  async getPhotoById(@Args('getPhotoData') { id: photoId }: GetPhotoInput) {
    return this.photoService.getPhotoById(photoId);
  }

  @Query(() => PhotoLikesUserListResponse)
  async getPhotoLikesUsers(
    @Args('getPhotoData') { id: photoId }: GetPhotoInput,
  ): Promise<PhotoLikesUserListResponse> {
    return this.photoService.getPhotoLikesUsers(photoId);
  }

  @Query(() => PhotoListResponse)
  async getPhotosByKeyword(
    @Args('photoListData') photoListData: GetPhotoListInput,
  ) {
    return this.photoService.getPhotosByKeyword(photoListData);
  }

  @Roles(GuardRole.AUTH)
  @Mutation(() => PhotoResponse)
  async editPhoto(
    @AuthUser() authUser: User,
    @Args('editPhotoData') editPhotoData: EditPhotoInput,
  ) {
    return this.photoService.editPhoto(authUser, editPhotoData);
  }

  @Roles(GuardRole.AUTH)
  @Mutation(() => PhotoResponse)
  async uploadPhoto(
    @AuthUser() authUser: User,
    @Args('uploadPhotoData') uploadPhotoData: UploadPhotoInput,
  ) {
    return this.photoService.uploadPhoto(authUser, uploadPhotoData);
  }
}
