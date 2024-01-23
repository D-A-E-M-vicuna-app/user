import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class DeleteUserInput {

    @Field()
    email: string;
}