import { Resolver, Query, Mutation, Arg, Float } from "type-graphql";
import { WeightClass } from "../entities/WeightClass";

/**
 * Resolver for WeightClass operations
 * Allows querying all weight classes and creating new ones
 */
@Resolver(() => WeightClass)
export class WeightClassResolver {
  /**
   * Retrieve all weight classes
   * @returns Promise resolving to an array of WeightClass objects
   */
  @Query(() => [WeightClass])
  async weightClasses(): Promise<WeightClass[]> {
    return WeightClass.find();
  }

  /**
   * Create a new weight class
   * @param name - Unique name of the weight class (e.g., "Middleweight")
   * @param minWeight - Minimum weight in pounds
   * @param maxWeight - Maximum weight in pounds
   * @returns Promise resolving to the newly created WeightClass object
   */
  @Mutation(() => WeightClass)
  async createWeightClass(
    @Arg("name") name: string,
    @Arg("minWeight", () => Float) minWeight: number,
    @Arg("maxWeight", () => Float) maxWeight: number
  ): Promise<WeightClass> {
    const wc = WeightClass.create({ name, minWeight, maxWeight });
    return wc.save();
  }
}
