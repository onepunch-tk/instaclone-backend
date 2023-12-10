import { Injectable } from '@nestjs/common';
import { User } from '../common/models/user.model';
import { UploadPhotoInput } from './dto/input/upload-photo.input';

@Injectable()
export class PhotoService {
  uploadPhoto(authUser: User, uploadPhotoData: UploadPhotoInput) {
    return Promise.resolve(undefined);
  }
}
