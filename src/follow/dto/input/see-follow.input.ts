import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { SeeFollowRole } from '../../../constants/role.enum';

// FollowRole enum을 GraphQL에 등록
registerEnumType(SeeFollowRole, {
  name: 'SeeFollowRole', // GraphQL에서 사용될 Enum의 이름
});

@InputType()
export class SeeFollowInput {
  @Field(() => String)
  username: string;

  @Field(() => Int, { nullable: true })
  afterId?: number;

  @Field(() => SeeFollowRole, {
    nullable: false,
    defaultValue: SeeFollowRole.ALL_FOLLOW,
  })
  role: SeeFollowRole;
}
