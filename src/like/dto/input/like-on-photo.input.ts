import { InputType, PickType } from '@nestjs/graphql';
import { Photo } from '../../../common/models/photo.model';

@InputType()
export class LikeOnPhotoInput extends PickType(
  Photo,
  ['id'] as const,
  InputType,
) {}
