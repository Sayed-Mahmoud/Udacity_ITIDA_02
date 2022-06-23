CREATE TABLE IF NOT EXISTS orders 
(
	id SERIAL Primary Key, 
	product_id INT NOT NULL, 
	user_id INT NOT NULL, 
	quantity INT NOT NULL, 
	status VARCHAR(8) NOT NULL DEFAULT('active'),
	CONSTRAINT order_product_id FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT order_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);