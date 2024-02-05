CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
);

INSERT INTO users (username, passhash) VALUES ($1, $2);