import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput  {
  
 

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field()
  oldEmail: string;

  @Field()
  newEmail: string;
 
}
