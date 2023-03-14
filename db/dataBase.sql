CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    games_count INT,
    games_wins_count INT,
    sparring_count INT,
    sparring_wins_count INT
);