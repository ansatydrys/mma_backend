import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Float } from "type-graphql";

@ObjectType()
@Entity()
export class WeightClass extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

  @Field(() => Float)
  @Column("decimal")
  minWeight: number;

  @Field(() => Float)
  @Column("decimal")
  maxWeight: number;
}