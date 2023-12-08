import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { User } from '../common/models/user.model';
import { CreateAccountInput } from './dto/input/create-account.input';
import { hash } from '@node-rs/bcrypt';
import { UserResponse } from './dto/reponse/user.response';
import { ProfileArgs } from './dto/args/profile.args';
import { EditProfileInput } from './dto/input/edit-profile.input';
import { EditProfileResponse } from './dto/reponse/edit-profile.response';
import { createWriteStream } from 'fs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaRepository) {}

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
      const hashedPassword = await hash(createAccountData.password, 12);

      // UserCreateArgs 타입에 맞게 데이터 변환
      const userData = {
        ...createAccountData,
        password: hashedPassword,
      };

      // 함수, 심볼, undefined 값을 제거
      const cleanedData = JSON.parse(JSON.stringify(userData));

      //save and return the user
      const createdUser = await this.prisma.user.create({
        data: cleanedData,
      });
      return {
        data: { ...createdUser, followedBy: [], following: [] },
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

      let avatar: string = '';
      if (editProfileData.avatar) {
        const { filename, createReadStream } = await editProfileData.avatar;
        const uploadFileName = `${authUser.id}$${Date.now()}$${filename}`;
        /* local test */
        const readStream = createReadStream();
        const writeStream = createWriteStream(
          `${process.cwd()}/uploads/${uploadFileName}`,
        );
        readStream.pipe(writeStream);
        delete editProfileData.avatar;
        avatar = `http://localhost:3000/static/${uploadFileName}`;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: authUser.id },
        data: {
          ...editProfileData,
          ...(avatar && { avatar }),
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
        include: {
          following: true,
          followedBy: true,
        },
      });
      if (!findUser) {
        throw new Error('Not found User.');
      }
      console.log(findUser);
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
