CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username varchar(50) UNIQUE NOT NULL,
    password varchar(50) NOT NULL,
    role varchar(20) NOT NULL
);
