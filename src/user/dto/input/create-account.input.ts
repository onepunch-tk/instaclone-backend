import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';

@InputType()
export class CreateAccountInput extends OmitType(
  User,
  ['id', 'createdAt', 'updatedAt', 'followedBy', 'following'] as const,
  InputType,
) {
  @Field(() => String)
  password: string;
}
