import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, [
    'firstName',
    'lastName',
    'username',
    'email',
    'bio',
  ] as const),
  InputType,
) {
  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => GraphQLUpload, { nullable: true })
  avatar: Promise<FileUpload>;
}
