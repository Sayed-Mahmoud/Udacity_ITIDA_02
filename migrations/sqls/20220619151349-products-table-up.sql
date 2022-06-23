CREATE TABLE IF NOT EXISTS products 
(
	"id" SERIAL Primary Key, 
	"name" VARCHAR(255) NOT NULL, 
	price NUMERIC(18,2) NOT NULL, 
	category VARCHAR(50)
);