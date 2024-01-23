import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {

  @Field()
  recoveryPasswordCode: string;

  @Field()
  newPassword: string;

  @Field()
  confirmNewPassword: string;

}
