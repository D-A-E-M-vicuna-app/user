import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserResponse {
  @Field()
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  accessToken?: string;
}