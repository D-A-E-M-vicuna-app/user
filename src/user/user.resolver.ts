import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => LoginUserResponse, {name: 'login'})
  login(@Args('LoginUserInput') loginUserInput: LoginUserInput): Promise<LoginUserResponse>{
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
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
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

}
