import {
  Args,
  Context,
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
import { PaginationInput } from '../common/dto/input/pagination.input';
import { HashtagLoader } from '../common/loaders/hashtag.loader';

@Roles(GuardRole.PUBLIC)
@Resolver(() => Photo)
export class PhotoResolver {
  constructor(
    private readonly photoService: PhotoService,
    private readonly hashtagLoader: HashtagLoader,
  ) {}

  @ResolveField(() => User)
  async user(@Parent() { userId }: Photo) {
    return this.photoService.getUserOfPhoto(userId);
  }

  @ResolveField(() => [Hashtag])
  async hashtags(@Parent() { id: photoId }: Photo) {
    return this.hashtagLoader.batchHashtag.load(photoId);
  }

  @ResolveField(() => Boolean)
  async isMine(@Parent() { userId }: Photo, @Context() ctx: any) {
    const authUser = ctx.authUser;
    if (!authUser) return false;
    return userId === authUser.id;
  }

  @ResolveField(() => Int)
  async likes(@Parent() { id: photoId }: Photo) {
    return this.photoService.getLikes(photoId);
  }

  @ResolveField(() => Int)
  async comments(@Parent() { id: photoId }: Photo) {
    return this.photoService.getComments(photoId);
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
  @Query(() => PhotoListResponse)
  async getFeeds(
    @AuthUser() authUser: User,
    @Args('paginationData') paginationData: PaginationInput,
  ) {
    return this.photoService.getFeeds(authUser, paginationData);
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

  // @Roles(GuardRole.AUTH)
  // @Mutation(() => DeletePhotoResponse)
  // async deletePhoto(
  //   @AuthUser() authUser: User,
  //   @Args('deletePhotoData') deletePhotoData: DeletePhotoInput,
  // ) {
  //   return this.photoService.deletePhoto(authUser.id, deletePhotoData.id);
  // }
}
