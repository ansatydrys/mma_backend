import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Event } from "../entities/Event";
import { UserInputError } from "apollo-server";


@Resolver(() => Event)
export class EventResolver {
  /**
   * Retrieve all events, including their associated fights
   * @returns Promise resolving to an array of Event objects
   */
  @Query(() => [Event])
  async events(): Promise<Event[]> {
    return Event.find({ relations: ["fights"] });
  }

  /**
   * Retrieve a single event by its ID
   * @param id - The unique identifier of the event
   * @returns Promise resolving to the Event or null if not found
   */
  @Query(() => Event, { nullable: true })
  async event(
    @Arg("id", () => Int) id: number
  ): Promise<Event | null> {
    return Event.findOne({ where: { id }, relations: ["fights"] });
  }

  /**
   * Create a new event
   * @param name - Name of the event (e.g., "UFC Fight Night")
   * @param eventDate - Date of the event in YYYY-MM-DD format
   * @param location - Location of the event (e.g., "Las Vegas, NV")
   * @returns Promise resolving to the newly created Event
   */
  @Mutation(() => Event)
  async createEvent(
    @Arg("name") name: string,
    @Arg("eventDate") eventDate: string,
    @Arg("location") location: string
  ): Promise<Event> {
    const event = Event.create({ name, eventDate, location });
    return event.save();
  }

  /**
   * Update an existing event.
   * Only fields provided will be modified
   * @param id - ID of the event to update
   * @param name - (Optional) New name for the event
   * @param eventDate - (Optional) New date for the event
   * @param location - (Optional) New location for the event
   * @throws UserInputError if the event is not found
   * @returns Promise resolving to the updated Event
   */
  @Mutation(() => Event)
  async updateEvent(
    @Arg("id", () => Int) id: number,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("eventDate", { nullable: true }) eventDate?: string,
    @Arg("location", { nullable: true }) location?: string
  ): Promise<Event> {
    const event = await Event.findOne({ where: { id } });
    if (!event) throw new UserInputError("Event not found");
    if (name !== undefined) event.name = name;
    if (eventDate !== undefined) event.eventDate = eventDate;
    if (location !== undefined) event.location = location;
    return event.save();
  }

  /**
   * Delete an event by ID
   * @param id - ID of the event to delete
   * @returns Promise resolving to true if deletion succeeded, false otherwise
   */
  @Mutation(() => Boolean)
  async deleteEvent(
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    const result = await Event.delete(id);
    return result.affected! > 0;
  }
}
