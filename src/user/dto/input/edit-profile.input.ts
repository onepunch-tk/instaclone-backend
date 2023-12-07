import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class EditProfileInput extends PartialType(
  OmitType(User, ['createdAt', 'updatedAt', 'avatar'] as const),
  InputType,
) {
  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => GraphQLUpload, { nullable: true })
  avatar: Promise<FileUpload>;
}
