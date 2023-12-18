import { InputType, PickType } from '@nestjs/graphql';
import { User } from 'src/common/models/user.model';

@InputType()
export class GetUserInput extends PickType(
  User,
  ['username'] as const,
  InputType,
) {}
