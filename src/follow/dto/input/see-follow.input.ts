import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { SeeFollowRole } from '../../../constants/role.enum';
import { PaginationInput } from '../../../common/graphql/input';

// FollowRole enum을 GraphQL에 등록
registerEnumType(SeeFollowRole, {
  name: 'SeeFollowRole', // GraphQL에서 사용될 Enum의 이름
});

@InputType()
export class SeeFollowInput extends PaginationInput {
  @Field(() => String)
  username: string;

  @Field(() => SeeFollowRole, {
    nullable: false,
    defaultValue: SeeFollowRole.ALL_FOLLOW,
  })
  role: SeeFollowRole;
}
