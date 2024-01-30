import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { DeleteUserResponse } from './responses/delete-user.response';
import { DeleteUserInput } from './dto/delete-user.input';
import { LoginUserResponse } from './responses/login-user.response';
import { LoginUserInput } from './dto/login-user.input';
import { CreateUserResponse } from './responses/create-user.response';
import { recoveryPasswordResponse } from './responses/recovery-password.response';
import { RecoveryPasswordInput } from './dto/recovery-password.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { ChangePasswordResponse } from './responses/change-password.response';
import { UpdateUserResponse } from './responses/update-user.response';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  //@UseGuards(AuthGuard)
  @Mutation(() => LoginUserResponse, { name: 'login' })
  login(@Args('LoginUserInput') loginUserInput: LoginUserInput, @Context() context): Promise<LoginUserResponse> {
    console.log('Contexto:', context.req.headers);
    return this.userService.login(loginUserInput);
  }

  @Mutation(() => User)
  createUser(@Args('CreateUserInput') createUserInput: CreateUserInput): Promise<CreateUserResponse> {//register
    return this.userService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'findAllUsers' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number):Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => DeleteUserResponse, { name: 'deleteUser' })
  async deleteUser(@Args('DeleteUserInput') deleteUserInput: DeleteUserInput): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(deleteUserInput.email);
  }

  @Mutation(() => recoveryPasswordResponse, { name: 'recoveryPassword' })
  async recoveryPassword(@Args('RecoveryPasswordInput') recoveryPasswordInput: RecoveryPasswordInput): Promise<recoveryPasswordResponse> {
    return this.userService.recoveryPassword(recoveryPasswordInput.email);
  }

  @Mutation(() => ChangePasswordResponse, { name: 'changePassword' })
  async changePassword(@Args('ChangePasswordInput') changePasswordInput: ChangePasswordInput): Promise<ChangePasswordResponse> {
    return this.userService.changePassword(changePasswordInput);
  }

  @Mutation(() => UpdateUserResponse, { name: 'updateUser' })
  async updateUser(@Args('UpdateUserInput') updateUserInput: UpdateUserInput): Promise<UpdateUserResponse> {
    return this.userService.updateUser(updateUserInput);
  }

}
