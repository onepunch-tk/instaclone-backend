import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';

@InputType()
export class CreateAccountInput extends PickType(
  User,
  ['firstName', 'lastName', 'username', 'email', 'bio'] as const,
  InputType,
) {
  @Field(() => String)
  password: string;
}
