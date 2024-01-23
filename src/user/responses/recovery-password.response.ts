import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class recoveryPasswordResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}