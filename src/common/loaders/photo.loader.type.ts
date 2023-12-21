import { PaginationInput } from '../dto/input/pagination.input';

export type BatchUserPhotosArgs = {
  userIds: number[];
  paginationData: PaginationInput;
};
