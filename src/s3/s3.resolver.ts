import { Args, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { S3Service } from './s3.service';
import { SignedUrlInput } from './dto/input/signed-url.input';
import { SignedUrlResponse } from './dto/response/signed-url.response';

@Roles(GuardRole.AUTH)
@Resolver()
export class S3Resolver {
  constructor(private readonly s3Service: S3Service) {}

  @Query(() => SignedUrlResponse)
  async getSignedUrl(
    @Args('signedUrlData') signedUrlData: SignedUrlInput,
  ): Promise<SignedUrlResponse> {
    return this.s3Service.getSignedUrl(signedUrlData);
  }
}
