import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LoginUserResponse {
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

  @Field()
  role: string; 

  @Field(() => Int, { nullable: true })
  institutionId?: number;
}