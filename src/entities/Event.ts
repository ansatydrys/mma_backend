import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Fight } from "./Fight";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("date")
  eventDate: string;

  @Field()
  @Column()
  location: string;

  @Field(() => [Fight])
  @OneToMany(() => Fight, fight => fight.event)
  fights: Fight[];
}