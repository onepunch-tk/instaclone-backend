import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../../../models/user.model';

@InputType()
export class SigninInput extends PickType(
  User,
  ['username'] as const,
  InputType,
) {
  @Field(() => String)
  password: string;
}
