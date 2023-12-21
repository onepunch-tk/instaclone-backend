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
import { GetHashtagInput } from './dto/input/get-hashtag.input';
import { Photo } from '../common/models/photo.model';
import { PaginationInput } from '../common/dto/input/pagination.input';

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
    @Args('paginationData') paginationData: PaginationInput,
  ) {
    return this.hashtagService.getPhotos(id, paginationData);
  }

  @Query(() => HashtagResponse)
  async getHashtag(@Args('getHashtagData') getHashtagData: GetHashtagInput) {
    return this.hashtagService.getHashtag(getHashtagData);
  }
}
