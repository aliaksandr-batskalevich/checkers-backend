CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    activation_link VARCHAR(255),
    is_activated BOOLEAN DEFAULT false,
    games_count INT DEFAULT 0,
    games_wins_count INT  DEFAULT 0,
    sparring_count INT DEFAULT 0,
    sparring_wins_count INT DEFAULT 0,
    rating INT DEFAULT 0
);

INSERT INTO statistics (user_id, games_count, games_wins_count, sparring_count, sparring_wins_count, rating) SELECT id, games_count, games_wins_count, sparring_count, sparring_wins_count, rating FROM users;
ALTER TABLE users DROP COLUMN games_count, games_wins_count, sparring_count, sparring_wins_count, rating;


CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users (id),
    author VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL
);



CREATE TABLE statistics (
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id), 
    games_count INT DEFAULT 0,
    games_wins_count INT  DEFAULT 0,
    sparring_count INT DEFAULT 0,
    sparring_wins_count INT DEFAULT 0,
    rating INT DEFAULT 0
);






ALTER TABLE users ADD rating INT DEFAULT 0;
ALTER TABLE users ALTER games_count SET DEFAULT 0;
ALTER TABLE users ALTER games_wins_count SET DEFAULT 0;
ALTER TABLE users ALTER sparring_count SET DEFAULT 0;
ALTER TABLE users ALTER sparring_wins_count SET DEFAULT 0;
ALTER TABLE users ALTER is_activated SET DEFAULT false;