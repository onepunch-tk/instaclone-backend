import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { FollowRole } from '../../../constants/role.enum';
import { PaginationInput } from '../../../common/dto/input';

// FollowRole enum을 GraphQL에 등록
registerEnumType(FollowRole, {
  name: 'FollowRole', // GraphQL에서 사용될 Enum의 이름
});

@InputType()
export class GetFollowInput extends PaginationInput {
  @Field(() => String)
  username: string;

  @Field(() => FollowRole, {
    nullable: false,
    defaultValue: FollowRole.ALL_FOLLOW,
  })
  role: FollowRole;
}
