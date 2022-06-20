# Build a Storefront Backend—Advanced Full-Stack Web Development

This application contains Users, Products, and Orders. Creating a user will encrypt the password using JWT. Every user can know her token and can be adding products, but after authorization. Also, every user can make orders, and see his orders, Also can update an order status.

# Database

users (id Serial/Auto Increment and PK to avoid duplicates, firstname character(50), lastname character(50), password text)
products (id Serial/Auto Increment and PK to avoid duplicates, name character(255), price numeric(18,2), category character(50) and can be null/empty)
orders (id Serial/Auto Increment and PK to avoid duplicates, 
product_id is number and FK references to table products and column id,
user_id is number and FK references to table users and column id,
quantity is a number,
status is character(8) and can be active or complete)

# Database Relationships 

user has one with many orders.
product has one with many orders.

# Handlers/Routers

Default port is 3000.

users: -
get -> index: http://localhost:3000/users To show all users with details. [token required]

get -> show: http://localhost:3000/users/{:id} To show a single user. example http://localhost:3000/users/1 [token required]

post -> create: http://localhost:3000/users?firstname={}&lastname={}&password={} To create a user. example: http://localhost:3000/users?firstname=Sayed&lastname=Gomaa&password=test12345 [token required]

post -> authenticate :http://localhost:3000/users/authenticate?firstname={}&lastname={}&password={} To get a user token. example: http://localhost:3000/users/authenticate?firstname=Sayed&lastname=Gomaa&password=test12345


products: -
get -> index: http://localhost:3000/products To show all products with details.

get -> index/top5: http://localhost:3000/products/top5 To show the top 5 products with details.

get -> index/cats: http://localhost:3000/products/cats/{:cat} To show all products that contain a custom category with details. example: http://localhost:3000/products/cats/phone or http://localhost:3000/products/cats/ph

get -> show: http://localhost:3000/products/{:id} To show a single product. example http://localhost:3000/products/1

post -> create: http://localhost:3000/products?name={}&price={}&category={} To create a product. example: http://localhost:3000/products?name=mobile&price=123.5&category=phone [token required]

put -> update: http://localhost:3000/products?id={}name={}&price={}&category={} To create a product. example: http://localhost:3000/products?id=1&name=mobile&price=123.5&category=phone [token required]

delete -> destroy: http://localhost:3000/products?id={} To delete a single product. example http://localhost:3000/products?id=1 [token required]


orders: -
get -> index: http://localhost:3000/orders/{:userid} To show your orders with details. [token required]

get -> index/completed: http://localhost:3000/orders/completed/{:userid} To show your completed orders with details. [token required]

post -> create: http://localhost:3000/orders?user_id={}&product_id={}&quantity={}&status={} To make an order. example: http://localhost:3000/orders?userid=37&productid=38&quantity=5&status=active [token required]

put -> update status: http://localhost:3000/orders?id={}&status={} To update an order status. example: http://localhost:3000/orders?id=39&status=complete [token required]

delete -> destroy: http://localhost:3000/orders?id={} To cancel/delete a single order. example http://localhost:3000/orders?id=39 [token required]


# .env file variables

POSTGRES_HOST
POSTGRES_DB
POSTGRES_TEST_DB
POSTGRES_USER
POSTGRES_PASSWORD
ENV can be 'test' or 'env'.
BCRYPT_PASSWORD
SALT_ROUNDS
TOKEN_SECRET

# References

Udacity Vidoas/Cources & Slack and Zoom Meetings.
http://stackoverflow.com
https://www.npmjs.com/package
https://nodejs.dev
https://expressjs.com
https://robertcooper.me
https://www.tutorialsteacher.com
https://github.com
https://codeforgeek.com
https://jwt.io/
https://siddharthac6.medium.com
https://blog.codinghorror.com
https://www.lifewire.com

# Steps to install the application

1: run 'npm install' command to restore node modules.
2: then 'npm run build' or 'npm run build2' to build the 'dist' folder.
3: and 'npm run test' for test operation with jasmine.
4: And to start the project 'npm run start' command.

# Other Commands

-   npm run watch
-   npm run lint
-   npm run prettier
-   npm run typings
-   npm run jasmine
-   npm run lint
-   npm run prettier
-   npm run tsc