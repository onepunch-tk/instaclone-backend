import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { PhotoService } from './photo.service';
import { PhotoResponse } from './dto/response/photo.response';
import { UploadPhotoInput } from './dto/input/upload-photo.input';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../common/models/user.model';

@Roles(GuardRole.AUTH)
@Resolver()
export class PhotoResolver {
  constructor(private readonly photoService: PhotoService) {}

  @Mutation(() => PhotoResponse)
  async uploadPhoto(
    @AuthUser() authUser: User,
    @Args('uploadPhotoData') uploadPhotoData: UploadPhotoInput,
  ) {
    return this.photoService.uploadPhoto(authUser, uploadPhotoData);
  }
}
