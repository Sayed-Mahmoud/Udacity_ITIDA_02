# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: 
    index Method, URL: http://localhost:3000/products
- Show: 
    show Method, URL: http://localhost:3000/products/{:id}
- Create: [token required]
    create Method, URL: http://localhost:3000/products?name={}&price={}&category={}
- [OPTIONAL] Top 5 most popular products: 
    top5 Method, URL: http://localhost:3000/products/top5
- [OPTIONAL] Products by category (args: product category):
    prodByCats Method, URL: http://localhost:3000/products/cats/{:cat}
- [OPTIONAL] update [token required]: 
    update Method, URL: http://localhost:3000/products?id={}name={}&price={}&category={}
- [OPTIONAL] delete [token required]: 
    destroy Method, URL: http://localhost:3000/products?id={}

#### Users
- Index [token required]: 
    index Method, URL: http://localhost:3000/users
- Show [token required]: 
    show Method, URL: http://localhost:3000/users/{:id}
- Create [token required]: 
    create Method, URL: http://localhost:3000/users?firstname={}&lastname={}&password={}
- [OPTIONAL] Authentication: 
    authenticate Method, URL: http://localhost:3000/users/authenticate?firstname={}&lastname={}&password={}

#### Orders
- Current Order by user (args: user id) [token required]: 
    show Method, URL: http://localhost:3000/orders/{:userid}
- [OPTIONAL] Completed Orders by user (args: user id) [token required]:
    showCompleted Method, URL: http://localhost:3000/orders/completed/{:userid}
- [OPTIONAL] Create [token required]: 
    create Method, URL: http://localhost:3000/orders?user_id={}&product_id={}&quantity={}&status={}
- [OPTIONAL] update [token required]: 
    update Method, URL: http://localhost:3000/orders?id={}&status={}
- [OPTIONAL] delete [token required]: 
    destroy Method, URL: http://localhost:3000/orders?id={}


## Data Shapes
#### Product
- id: Serial, PK
- name: character(255)
- price: numeric(18,2)
- [OPTIONAL] category: character(50)

#### User
- id: Serial, PK
- firstName: character(50)
- lastName: character(50)
- password: text

#### Orders
- id: Serial, PK
- product_id: number, FK
- quantity: number
- user_id: number, FK
- status (active or complete): character(8)

