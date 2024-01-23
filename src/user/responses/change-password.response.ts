import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChangePasswordResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}