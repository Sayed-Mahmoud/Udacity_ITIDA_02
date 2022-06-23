CREATE TABLE IF NOT EXISTS order_products 
(
	"id" SERIAL Primary Key, 
	order_id INT NOT NULL, 
	product_id INT NOT NULL, 
	quantity INT NOT NULL, 
	CONSTRAINT order_products_product_id FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT order_products_order_id FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
);