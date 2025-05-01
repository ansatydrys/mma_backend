import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Event } from "./Event";
import { Fighter } from "./Fighter";

@ObjectType()
@Entity()
export class Fight extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Event)
  @ManyToOne(() => Event, event => event.fights, { onDelete: "CASCADE" })
  event: Event;

  @Field(() => Fighter)
  @ManyToOne(() => Fighter)
  fighterA: Fighter;

  @Field(() => Fighter)
  @ManyToOne(() => Fighter)
  fighterB: Fighter;

  @Field(() => Fighter, { nullable: true })
  @ManyToOne(() => Fighter, { nullable: true })
  winner?: Fighter;

  @Field({ nullable: true })
  @Column({ nullable: true })
  method?: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, type: "int" })
  round?: number;

  @Field({ nullable: true })
  @Column({ nullable: true, type: "time" })
  time?: string;
}
