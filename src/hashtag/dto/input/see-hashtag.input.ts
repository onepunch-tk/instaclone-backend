import { InputType, PickType } from '@nestjs/graphql';
import { Hashtag } from '../../../common/models/hashtag.model';

@InputType()
export class SeeHashtagInput extends PickType(
  Hashtag,
  ['hashtag'] as const,
  InputType,
) {}
