import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { FollowRole } from '../../../constants/role.enum';

// FollowRole enum을 GraphQL에 등록
registerEnumType(FollowRole, {
  name: 'FollowRole', // GraphQL에서 사용될 Enum의 이름
});

@InputType()
export class FollowInput {
  @Field(() => String)
  username: string;

  @Field(() => FollowRole)
  role: FollowRole;
}
