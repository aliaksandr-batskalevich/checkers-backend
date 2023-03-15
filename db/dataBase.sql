CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    refresh_token VARCHAR(255),
    activation_link VARCHAR(255),
    is_activated BOOLEAN,
    games_count INT,
    games_wins_count INT,
    sparring_count INT,
    sparring_wins_count INT
);

