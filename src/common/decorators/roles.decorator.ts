import { SetMetadata } from '@nestjs/common';
import { GuardRole } from '../../constants/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: GuardRole[]) => SetMetadata(ROLES_KEY, roles);
