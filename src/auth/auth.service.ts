import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { SignInInput } from './dto/input/sign-in.input';
import { SignInResponse } from './dto/response/sign-in.response';
import { verify } from '@node-rs/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInData: SignInInput): Promise<SignInResponse> {
    try {
      const { username, password } = signInData;
      const authUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!authUser) {
        throw new NotFoundException('Not found User.');
      }

      //check password
      const verifyPassword = await verify(password, authUser.password);
      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid password.');
      }

      // const token = jwt.sign({ id: findUser.id }, process.env.SECRET_KEY);
      const token = await this.jwtService.signAsync({ authUser });

      return { data: { token } };
    } catch (e) {
      return {
        errors: { message: e.message },
      };
    }
  }
}
