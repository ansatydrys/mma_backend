import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Fighter } from "./Fighter";

@ObjectType()
@Entity()
export class Ranking extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Fighter)
  @OneToOne(() => Fighter)
  @JoinColumn()
  fighter: Fighter;

  @Field()
  @Column()
  weightClass: string;

  @Field(() => Int)
  @Column("int")
  rank: number;

  @Field()
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
