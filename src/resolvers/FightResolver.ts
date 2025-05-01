
import { Resolver, Mutation, Arg, Int, Query } from "type-graphql";
import { Fight } from "../entities/Fight";
import { Event } from "../entities/Event";
import { Fighter } from "../entities/Fighter";
import { Ranking } from "../entities/Ranking";
import { MoreThan } from "typeorm";
import { UserInputError } from "apollo-server";

/**
 * Resolver for Fight-related operations
 * Handles scheduling fights, recording results, querying upcoming bouts
 * retrieving fighter statistics, and deleting fights
 */
@Resolver(() => Fight)
export class FightResolver {
  /**
   * Schedule a new fight without results
   * @param eventId - ID of the event in which the fight will take place
   * @param fighterAId - ID of the first fighter
   * @param fighterBId - ID of the second fighter
   * @returns The newly created Fight object
   */
  @Mutation(() => Fight)
  async createFight(
    @Arg("eventId", () => Int) eventId: number,
    @Arg("fighterAId", () => Int) fighterAId: number,
    @Arg("fighterBId", () => Int) fighterBId: number
  ): Promise<Fight> {
    const event = await Event.findOneOrFail({ where: { id: eventId } });
    const fighterA = await Fighter.findOneOrFail({ where: { id: fighterAId } });
    const fighterB = await Fighter.findOneOrFail({ where: { id: fighterBId } });

    const fight = Fight.create({ event, fighterA, fighterB });
    return fight.save();
  }

  /**
   * Record fight results, update fighter stats, and recalculate rankings
   * @param fightId - ID of the fight to update
   * @param winnerId - ID of the winning fighter
   * @param method - Method of victory (e.g., "KO", "Submission")
   * @param round - Round number in which fight ended
   * @param time - Timestamp of fight end (MM:SS format)
   * @returns The updated Fight object with results
   */
  @Mutation(() => Fight)
  async recordFightResult(
    @Arg("fightId", () => Int) fightId: number,
    @Arg("winnerId", () => Int) winnerId: number,
    @Arg("method") method: string,
    @Arg("round", () => Int) round: number,
    @Arg("time") time: string
  ): Promise<Fight> {
    const fight = await Fight.findOne({
      where: { id: fightId },
      relations: ["fighterA", "fighterB", "fighterA.weightClass"]
    });
    if (!fight) throw new UserInputError("Fight not found");

    const winner = await Fighter.findOneOrFail({ where: { id: winnerId } });
    const loser = fight.fighterA.id === winner.id ? fight.fighterB : fight.fighterA;

    // Update fight record
    fight.winner = winner;
    fight.method = method;
    fight.round = round;
    fight.time = time;
    await fight.save();

    // Update fighter statistics
    winner.wins++;
    loser.losses++;
    await Promise.all([winner.save(), loser.save()]);

    // Recalculate rankings for the weight class
    const wcName = fight.fighterA.weightClass.name;
    const fightersInClass = await Fighter.find({ where: { weightClass: { name: wcName } } });
    fightersInClass.sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses));

    for (let i = 0; i < fightersInClass.length; i++) {
      const f = fightersInClass[i];
      let rank = await Ranking.findOne({ where: { fighter: { id: f.id } } });
      if (!rank) {
        rank = Ranking.create({ fighter: f, weightClass: wcName, rank: i + 1 });
      } else {
        rank.rank = i + 1;
        rank.updatedAt = new Date();
      }
      await rank.save();
    }

    return fight;
  }

  /**
   * Fetch fights whose event date is in the future
   * @returns Array of upcoming Fight objects
   */
  @Query(() => [Fight])
  async upcomingFights(): Promise<Fight[]> {
    return Fight.find({
      where: { event: { eventDate: MoreThan(new Date()) } },
      relations: ["event", "fighterA", "fighterB", "winner"]
    });
  }

  /**
   * Retrieve fight history for a specific fighter
   * @param fighterId - ID of the fighter whose stats to fetch
   * @returns Array of Fight objects involving the fighter
   */
  @Query(() => [Fight])
  async statsByFighter(@Arg("fighterId", () => Int) fighterId: number): Promise<Fight[]> {
    return Fight.find({
      where: [
        { fighterA: { id: fighterId } },
        { fighterB: { id: fighterId } }
      ],
      relations: ["event", "fighterA", "fighterB", "winner"]
    });
  }

  /**
   * Delete a fight by ID
   * @param id - ID of the fight to remove
   * @returns True if deletion succeeded, false otherwise
   */
  @Mutation(() => Boolean)
  async deleteFight(@Arg("id", () => Int) id: number): Promise<boolean> {
    const res = await Fight.delete(id);
    return res.affected! > 0;
  }
}
