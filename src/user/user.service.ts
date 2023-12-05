import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { User } from '../models/user.model';
import { CreateUserInput } from './dto/input/create-user.input';
import { hash } from '@node-rs/bcrypt';
import { CreateUserResponse } from './dto/reponse/create-user.response';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaRepository) {}
  async getUser(): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: 1 } });
  }

  async createAccount(
    createUserData: CreateUserInput,
  ): Promise<CreateUserResponse> {
    //check if username or email are already on db
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: createUserData.username },
            { email: createUserData.email },
          ],
        },
      });
      if (existingUser) {
        throw new Error('This username/password is already taken.');
      }
      //hash password
      createUserData.password = await hash(createUserData.password, 12);

      //save and return the user
      const createdUser = await this.prisma.user.create({
        data: {
          ...createUserData,
        },
      });
      return {
        success: true,
        user: createdUser,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }
}
