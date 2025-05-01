// src/index.ts
import { ApolloServer }     from "apollo-server";
import { buildSchema }      from "type-graphql";
import { AppDataSource }    from "./config/data-source";
import { FighterResolver }  from "./resolvers/FighterResolver";
import { EventResolver }    from "./resolvers/EventResolver";
import { FightResolver }    from "./resolvers/FightResolver";
import { WeightClassResolver } from "./resolvers/WeightClassResolver";

async function main() {
  await AppDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [
      WeightClassResolver,
      FighterResolver,
      EventResolver,
      FightResolver
    ],
    validate: true,
  });

  const server = new ApolloServer({
    schema,
    context: () => ({ dataSource: AppDataSource })
  });

  const { url } = await server.listen({ port: +process.env.PORT! });
  console.log(`Server ready at ${url}`);
}

main().catch(err => console.error(err));
