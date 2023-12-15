import { Field, InputType, PickType } from '@nestjs/graphql';
import { Photo } from '../../../common/models/photo.model';

@InputType()
export class EditPhotoInput extends PickType(
  Photo,
  ['id', 'caption'] as const,
  InputType,
) {
  @Field(() => String)
  caption: string; // 'caption' 필드를 필수로 재정의
}
