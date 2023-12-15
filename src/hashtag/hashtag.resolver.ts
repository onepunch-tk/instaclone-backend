import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { HashtagService } from './hashtag.service';
import { Hashtag } from '../common/models/hashtag.model';
import { HashtagResponse } from './dto/response/hashtag.response';
import { SeeHashtagInput } from './dto/input/see-hashtag.input';
import { Photo } from '../common/models/photo.model';
import { PhotoPaginationInput } from './dto/input/photo-pagenation.input';

@Roles(GuardRole.PUBLIC)
@Resolver(() => Hashtag)
export class HashtagResolver {
  constructor(private readonly hashtagService: HashtagService) {}

  @ResolveField(() => Int)
  async totalPhotos(@Parent() { id }: Hashtag) {
    return this.hashtagService.getTotalPhotoCount(id);
  }

  @ResolveField(() => [Photo])
  async photos(
    @Parent() { id }: Hashtag,
    @Args('photoPaginationData') photoPaginationData: PhotoPaginationInput,
  ) {
    return this.hashtagService.getPhotos(id, photoPaginationData);
  }

  @Query(() => HashtagResponse)
  async seeHashtag(@Args('seeHashtagData') seeHashtagData: SeeHashtagInput) {
    return this.hashtagService.seeHashtag(seeHashtagData);
  }
}
