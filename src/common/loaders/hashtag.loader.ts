import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Hashtag } from '../models/hashtag.model';
import { PhotoService } from '../../photo/photo.service';

@Injectable()
export class HashtagLoader {
  constructor(private readonly photoService: PhotoService) {}

  public readonly batchHashtag = new DataLoader<number, Hashtag[]>(
    async (photoIds: number[]) => {
      const photoHashtags = await this.photoService.getHashtagsByPhotoIds(
        photoIds,
      );
      const hashtagsMap = new Map<number, Hashtag[]>();
      photoHashtags.forEach((photo) => {
        if (!hashtagsMap.has(photo.id)) {
          hashtagsMap.set(photo.id, []);
        }
        hashtagsMap.get(photo.id).push(...photo.hashtags);
      });

      return photoIds.map((photoId) => hashtagsMap.get(photoId) || []);
    },
  );
}
