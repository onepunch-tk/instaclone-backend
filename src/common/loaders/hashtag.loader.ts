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

      const hashtagsMap = photoHashtags.reduce((map, hashtag) => {
        hashtag.photos.forEach((photo) => {
          if (!map.has(photo.photoId)) {
            map.set(photo.photoId, []);
          }
          map.get(photo.photoId).push({
            id: hashtag.id,
            name: hashtag.name,
            createdAt: hashtag.createdAt,
            updatedAt: hashtag.updatedAt,
          });
        });
        return map;
      }, new Map<number, Hashtag[]>());

      return photoIds.map((photoId) => hashtagsMap.get(photoId) || []);
    },
  );
}
