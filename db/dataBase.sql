CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    activation_link VARCHAR(255),
    is_activated BOOLEAN DEFAULT false,
);

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    status VARCHAR(255),
    time_status TIMESTAMP
);

CREATE TABLE statistics (
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    subscribers_count INT DEFAULT 0,
    games_junior_count INT DEFAULT 0,
    games_middle_count INT DEFAULT 0,
    games_senior_count INT DEFAULT 0,
    games_junior_wins_count INT  DEFAULT 0,
    games_middle_wins_count INT  DEFAULT 0,
    games_senior_wins_count INT  DEFAULT 0,
    sparring_count INT DEFAULT 0,
    sparring_wins_count INT DEFAULT 0,
    rating NUMERIC DEFAULT 0
);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    subscriber_id INT,
    FOREIGN KEY (subscriber_id) REFERENCES users (id),
    time_subscribe TIMESTAMP
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users (id),
    author VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP,
    level INT,
    is_won BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE game_progress (
    id SERIAL PRIMARY KEY,
    game_id INT,
    FOREIGN KEY (game_id) REFERENCES games (id),
    current_order VARCHAR(255),
    figures JSON
);


SELECT users.id, users.username, array_agg(statuses.status) FROM users FULL JOIN statuses ON users.id = statuses.user_id GROUP BY users.id;

CREATE USER alex WITH PASSWORD 'alex';
ALTER USER alex SUPERUSER;
INSERT INTO statistics (user_id, games_count, games_wins_count, sparring_count, sparring_wins_count, rating) SELECT id, games_count, games_wins_count, sparring_count, sparring_wins_count, rating FROM users;
ALTER TABLE users ADD rating INT DEFAULT 0;
ALTER TABLE statistics ALTER COLUMN rating TYPE NUMERIC;
