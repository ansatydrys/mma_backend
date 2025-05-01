# MMA Platform GraphQL API

A backend GraphQL API for managing mixed martial arts (MMA) data: fighters, events, fights, and rankings. Built with TypeScript, TypeORM, and Apollo Server.

---

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [Running the Server](#running-the-server)
7. [GraphQL Playground](#graphql-playground)
8. [API Usage Examples](#api-usage-examples)
9. [Database Artifacts](#database-artifacts)
10. [Further Documentation](#further-documentation)

---

## Features
- **CRUD** operations for Fighters, Events, Fights, and Weight Classes
- Schedule fights and record results in separate mutations
- Automatic ranking calculation by weight class
- Queries for upcoming fights and fighter statistics
- Built-in data validation and error handling

---

## Prerequisites
- **Node.js** v16+ and **npm**
- **PostgreSQL** database
- (Optional) **DBeaver** or **pgAdmin** for database inspection

---

## Project Structure
```
mma-app/
├─ .env         # sample environment variables
├─ README.md            # this file
├─ package.json
├─ tsconfig.json
└─ src/
   ├─ index.ts          # server bootstrap
   ├─ config/
   │  └─ data-source.ts # TypeORM DataSource setup
   ├─ entities/         # TypeORM entity definitions
   └─ resolvers/        # GraphQL resolver implementations
```

---

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone <repo-url> mma-app
   cd mma-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update values:
   ```bash
   cp .env.example .env
   ```

---

## Configuration
Edit `.env` with your Postgres credentials and server port:
```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=mma_db
PORT=4000
```  

---

## Running the Server
- **Development** (auto-restart):
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm run build
  npm start
  ```

---

## GraphQL Playground
Once running, explore the API at:
```
http://localhost:4000/graphql
```
Use the **Docs** sidebar for type definitions and operation templates.

---

## API Usage Examples
### List all weight classes
```graphql
query {
  weightClasses {
    name
    minWeight
    maxWeight
  }
}
```

### Create a fighter
```graphql
mutation {
  createFighter(
    name: "John Doe",
    nationality: "USA",
    weightClass: "Middleweight"
  ) {
    id
    name
  }
}
```

### Schedule a fight
```graphql
mutation {
  createFight(
    eventId: 1,
    fighterAId: 1,
    fighterBId: 2
  ) {
    id
    event { name }
  }
}
```

### Record fight result
```graphql
mutation {
  recordFightResult(
    fightId: 1,
    winnerId: 2,
    method: "KO",
    round: 2,
    time: "00:03:45"
  ) {
    id
    winner { name }
    method
  }
}
```

### Upcoming fights
```graphql
query {
  upcomingFights {
    id
    event { name eventDate }
    fighterA { name }
    fighterB { name }
  }
}
```

### Heavyweight rankings
```graphql
query {
  fightersByWeight(weightClassName: "Heavyweight") {
    name
    wins
    losses
    ranking { rank }
  }
}
```

---

## Database Artifacts
- **ERD**: Refer to `mma_schema.png` in repository root
- **DDL Script**: `mma_schema.sql` contains all `CREATE TABLE` statements

---

## Further Documentation
- **Migrations**: For production, disable `synchronize` in `data-source.ts` and use TypeORM migrations

---

Happy fighting and ranking!

