import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { PhotoService } from '../../photo/photo.service';
import { Photo } from '../models/photo.model';
import { BatchUserPhotosArgs } from './photo.loader.type';

@Injectable()
export class PhotoLoader {
  constructor(private readonly photoService: PhotoService) {}

  public readonly batchPhotos = new DataLoader<BatchUserPhotosArgs, Photo[]>(
    async (batchLoadArgs) => {
      // userIds를 단일 차원 배열로 변환
      const userIds = batchLoadArgs.map((arg) => arg.userIds).flat();
      const paginationData = batchLoadArgs[0].paginationData; // 첫 번째 paginationData를 사용합니다.

      const photos = await this.photoService.getPhotosByUserIds(
        userIds,
        paginationData,
      );
      const photosMap = new Map<number, Photo[]>();
      photos.forEach((photo) => {
        const photoList = photosMap.get(photo.userId) || [];
        photoList.push(photo);
        photosMap.set(photo.userId, photoList);
      });
      return userIds.map((userId) => photosMap.get(userId) || []);
    },
  );
}
