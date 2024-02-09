
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput  {
  
 

  @Field({nullable: true})
  firstName?: string;

  @Field({nullable: true})
  lastName?: string;

  @Field()
  oldEmail: string;

  @Field({nullable: true})
  newEmail?: string;
 
}
