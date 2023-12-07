import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { User } from '../common/models/user.model';
import { CreateAccountInput } from './dto/input/create-account.input';
import { hash } from '@node-rs/bcrypt';
import { UserResponse } from './dto/reponse/user.response';
import { ProfileArgs } from './dto/args/profile.args';
import { EditProfileInput } from './dto/input/edit-profile.input';
import { EditProfileResponse } from './dto/reponse/edit-profile.response';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaRepository) {}
  async getUser(): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: 1 } });
  }

  async createAccount(
    createAccountData: CreateAccountInput,
  ): Promise<UserResponse> {
    //check if username or email are already on db
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: createAccountData.username },
            { email: createAccountData.email },
          ],
        },
      });
      if (existingUser) {
        throw new Error('This username/password is already taken.');
      }
      //hash password
      createAccountData.password = await hash(createAccountData.password, 12);

      //save and return the user
      const createdUser = await this.prisma.user.create({
        data: {
          ...createAccountData,
        },
      });
      return {
        data: { ...createdUser },
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }

  async editProfile(
    authUser: User,
    editProfileData: EditProfileInput,
  ): Promise<EditProfileResponse> {
    try {
      if (editProfileData.password) {
        editProfileData.password = await hash(editProfileData.password, 12);
      }

      if (editProfileData.avatar) {
        const { filename, createReadStream } = await editProfileData.avatar;
        const stream = createReadStream();
        console.log(stream);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: authUser.id },
        data: {
          // ...editProfileData,
        },
      });

      if (updatedUser) {
        return { data: { ...updatedUser } };
      } else {
        throw new Error('Could not updated profile.');
      }
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }

  async seeProfile({ username }: ProfileArgs): Promise<UserResponse> {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!findUser) {
        throw new Error('Not found User.');
      }

      return {
        data: { ...findUser },
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }
}
