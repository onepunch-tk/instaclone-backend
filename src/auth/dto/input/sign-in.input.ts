import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';

@InputType()
export class SignInInput extends PickType(
  User,
  ['username'] as const,
  InputType,
) {
  @Field(() => String)
  password: string;
}
