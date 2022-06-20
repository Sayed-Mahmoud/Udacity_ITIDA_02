CREATE TABLE IF NOT EXISTS users 
(
	id SERIAL Primary Key, 
	firstname VARCHAR(25) NOT NULL, 
	lastname VARCHAR(25) NOT NULL, 
	password TEXT NOT NULL
);