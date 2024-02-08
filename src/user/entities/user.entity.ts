import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recoveryPasswordToken: string;

  @Field()
  @Column({ default: 'user' })
  role: string;

  @Field(() => Int, { nullable: true })
  @Column({nullable: true})
  institutionId?: number;
}
