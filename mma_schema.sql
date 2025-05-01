CREATE TABLE weight_classes (
  name        TEXT PRIMARY KEY,
  min_weight  DECIMAL NOT NULL,
  max_weight  DECIMAL NOT NULL
);

CREATE TABLE fighters (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  nickname     TEXT,
  nationality  TEXT NOT NULL,
  weight_class TEXT NOT NULL REFERENCES weight_classes(name),
  team         TEXT,
  wins         INTEGER DEFAULT 0,
  losses       INTEGER DEFAULT 0,
  draws        INTEGER DEFAULT 0,
  knockouts    INTEGER DEFAULT 0,
  submissions  INTEGER DEFAULT 0
);

CREATE TABLE events (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  event_date DATE NOT NULL,
  location   TEXT NOT NULL
);

CREATE TABLE fights (
  id              SERIAL PRIMARY KEY,
  event_id        INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  fighter_a_id    INTEGER NOT NULL REFERENCES fighters(id),
  fighter_b_id    INTEGER NOT NULL REFERENCES fighters(id),
  winner_id       INTEGER REFERENCES fighters(id),
  method          TEXT,
  round           INTEGER,
  time            TIME
);

CREATE TABLE rankings (
  id           SERIAL PRIMARY KEY,
  fighter_id   INTEGER UNIQUE NOT NULL REFERENCES fighters(id),
  weight_class TEXT NOT NULL REFERENCES weight_classes(name),
  rank         INTEGER NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
