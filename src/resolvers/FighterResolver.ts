import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Fighter } from "../entities/Fighter";
import { WeightClass } from "../entities/WeightClass";
import { UserInputError } from "apollo-server";

/**
 * Resolver for Fighter-related operations
 * Provides queries and mutations to manage fighters, including fetching, creating, updating, and deleting
 */
@Resolver(() => Fighter)
export class FighterResolver {
  /**
   * Retrieve all fighters, sorted by ascending ranking
   * @returns Promise resolving to an array of Fighter objects with relations loaded
   */
  @Query(() => [Fighter])
  async fighters(): Promise<Fighter[]> {
    const all = await Fighter.find({ relations: ["weightClass", "ranking"] });
    return all.sort((a, b) => a.ranking!.rank - b.ranking!.rank);
  }

  /**
   * Retrieve fighters filtered by weight class, sorted by ascending ranking
   * @param weightClassName - The name of the weight class to filter by
   * @returns Promise resolving to an array of Fighter objects
   */
  @Query(() => [Fighter], { name: "fightersByWeight" })
  async fightersByWeight(
    @Arg("weightClassName") weightClassName: string
  ): Promise<Fighter[]> {
    const fighters = await Fighter.find({
      where: { weightClass: { name: weightClassName } },
      relations: ["weightClass", "ranking"]
    });
    return fighters.sort((a, b) => a.ranking!.rank - b.ranking!.rank);
  }

  /**
   * Create a new fighter record
   * @param name - Full name of the fighter
   * @param nationality - Country code or nationality string
   * @param weightClass - Name of the fighter's weight class (must exist)
   * @param nickname - Optional ring nickname
   * @param team - Optional fight team or camp name
   * @returns Promise resolving to the created Fighter object
   */
  @Mutation(() => Fighter)
  async createFighter(
    @Arg("name") name: string,
    @Arg("nationality") nationality: string,
    @Arg("weightClass") weightClassName: string,
    @Arg("nickname", { nullable: true }) nickname?: string,
    @Arg("team", { nullable: true }) team?: string
  ): Promise<Fighter> {
    const weightClass = await WeightClass.findOneOrFail({ where: { name: weightClassName } });
    const fighter = Fighter.create({ name, nationality, weightClass, nickname, team });
    return fighter.save();
  }

  /**
   * Update an existing fighter's details
   * Only provided fields will be modified
   * @param id - ID of the fighter to update
   * @param name - (Optional) New name
   * @param nationality - (Optional) New nationality
   * @param weightClass - (Optional) New weight class name
   * @param nickname - (Optional) New nickname
   * @param team - (Optional) New team name
   * @throws UserInputError if fighter or weight class not found
   * @returns Promise resolving to the updated Fighter object
   */
  @Mutation(() => Fighter)
  async updateFighter(
    @Arg("id", () => Int) id: number,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("nationality", { nullable: true }) nationality?: string,
    @Arg("weightClass", { nullable: true }) weightClassName?: string,
    @Arg("nickname", { nullable: true }) nickname?: string,
    @Arg("team", { nullable: true }) team?: string
  ): Promise<Fighter> {
    const fighter = await Fighter.findOne({ where: { id }, relations: ["weightClass"] });
    if (!fighter) throw new UserInputError("Fighter not found");
    if (name !== undefined) fighter.name = name;
    if (nationality !== undefined) fighter.nationality = nationality;
    if (nickname !== undefined) fighter.nickname = nickname;
    if (team !== undefined) fighter.team = team;
    if (weightClassName) {
      const wc = await WeightClass.findOne({ where: { name: weightClassName } });
      if (!wc) throw new UserInputError("WeightClass not found");
      fighter.weightClass = wc;
    }
    return fighter.save();
  }

  /**
   * Delete a fighter by ID
   * @param id - ID of the fighter to delete
   * @returns Promise resolving to true if deletion was successful, false otherwise
   */
  @Mutation(() => Boolean)
  async deleteFighter(
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    const result = await Fighter.delete(id);
    return result.affected! > 0;
  }
}
