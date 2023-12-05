import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { CreateUserInput } from './dto/input/create-user.input';
import { CreateUserResponse } from './dto/reponse/create-user.response';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUser() {
    return this.userService.getUser();
  }

  @Mutation(() => CreateUserResponse)
  async createAccount(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<CreateUserResponse> {
    return this.userService.createAccount(createUserData);
  }
}
