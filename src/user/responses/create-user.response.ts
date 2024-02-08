import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateUserResponse {
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

  @Field({ nullable: true })
  recoveryPasswordToken?: string;

  @Field()
  role: string;

  @Field({ nullable: true})
  institutionId: number;
}