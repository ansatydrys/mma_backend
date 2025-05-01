import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { WeightClass } from "./WeightClass";
import { Ranking } from "./Ranking";

@ObjectType()
@Entity()
export class Fighter extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nickname?: string;

  @Field()
  @Column()
  nationality: string;

  @Field(() => WeightClass)
  @ManyToOne(() => WeightClass)
  weightClass: WeightClass;

  @Field({ nullable: true })
  @Column({ nullable: true })
  team?: string;

  @Field(() => Int)
  @Column({ default: 0 })
  wins: number;

  @Field(() => Int)
  @Column({ default: 0 })
  losses: number;

  @Field(() => Int)
  @Column({ default: 0 })
  draws: number;

  @Field(() => Int)
  @Column({ default: 0 })
  knockouts: number;

  @Field(() => Int)
  @Column({ default: 0 })
  submissions: number;

  @Field(() => Ranking, { nullable: true })
  @OneToOne(() => Ranking, ranking => ranking.fighter)
  ranking?: Ranking;
}