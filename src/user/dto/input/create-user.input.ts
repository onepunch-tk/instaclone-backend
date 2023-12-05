import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../../../models/user.model';

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ['id', 'createdAt', 'updatedAt'] as const,
  InputType,
) {
  @Field(() => String)
  password: string;
}
