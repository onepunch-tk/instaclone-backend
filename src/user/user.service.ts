import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { User } from '../models/user.model';
import { CreateUserInput } from './dto/input/create-user.input';
import { hash, verify } from '@node-rs/bcrypt';
import { UserResponse } from './dto/reponse/user.response';
import { ProfileArgs } from './dto/args/profile.args';
import { SigninInput } from './dto/input/signin.input';
import { SigninResponse } from './dto/reponse/signin.response';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaRepository) {}
  async getUser(): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: 1 } });
  }

  async createAccount(createUserData: CreateUserInput): Promise<UserResponse> {
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
        user: createdUser,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
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
        user: findUser,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async signin(signinData: SigninInput): Promise<SigninResponse> {
    try {
      const { username, password } = signinData;
      const findUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!findUser) {
        throw new Error('Not found User.');
      }

      //check password
      const verifyPassword = await verify(password, findUser.password);
      if (!verifyPassword) {
        throw new Error('Invalid password.');
      }

      const token = jwt.sign({ id: findUser.id }, process.env.SECRET_KEY);

      return { token };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }
}
