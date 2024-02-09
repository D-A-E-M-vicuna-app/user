import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserResponse {
  @Field()
  id: number;

  @Field({nullable: true})
  firstName: string;

  @Field({nullable: true})
  lastName: string;

  @Field({nullable: true})
  email: string;

  @Field({ nullable: true })
  accessToken?: string;
}