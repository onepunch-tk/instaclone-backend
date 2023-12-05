import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { User } from '../../../models/user.model';

@InputType()
export class EditProfileInput extends PartialType(
  OmitType(User, ['createdAt', 'updatedAt'] as const),
  InputType,
) {
  @Field(() => String, { nullable: true })
  password: string;
}
