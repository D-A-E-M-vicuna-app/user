import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class RecoveryPasswordInput {

  @Field()
  email: string;

}
