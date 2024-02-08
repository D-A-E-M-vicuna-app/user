import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role: string;

  @Field(type => Int, {nullable: true})  
  institutionId?: number;

}
