# Pizza Ordering System
An AngularJS application that can run on the browser with temporary database implemented via WebSQL Database API

## Steps to Run

1. From terminal or command prompt, CD to the installation directory

2. Execute command
```javascript
node server.js
```

Make sure nodeJS is installed on your machine.

3. Sql Queries for the table will be created and data will be inserted afterwards

4. You can now open the browser and go to http://localhost:3000

## Database Schema

```javascript

  CREATE TABLE IF NOT EXISTS product_categories (
    id INTEGER PRIMARY KEY,
    name varchar(255) NULL,
    description text NULL,
    code varchar(255) NULL
    );  

    
  CREATE TABLE IF NOT EXISTS product_sizes (
    id INTEGER PRIMARY KEY,
    inches varchar(255) NULL
    );  

    
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name varchar(255) NULL,
    description text NULL,
    product_category_id int(11) NULL,
    CONSTRAINT fk_product_category FOREIGN KEY (product_category_id) 
    REFERENCES product_categories (id) ON DELETE SET NULL
    );

    
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    total varchar(255) NULL,
    full_name varchar(255) NULL,
    mobile_number varchar(255) NULL,
    created_at TIMESTAMP DATE DEFAULT (datetime('now','localtime'))
    );

  CREATE TABLE IF NOT EXISTS products_with_sizes (
    id INTEGER PRIMARY KEY,
    product_id int(11) NULL,
    product_size_id int(11) NULL,
    price varchar(255) NULL,
    CONSTRAINT fk_products_product_sizes_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT fk_product_with_size_product_size FOREIGN KEY (product_size_id) REFERENCES product_sizes (id) ON DELETE CASCADE
    );

  CREATE TABLE IF NOT EXISTS transaction_items (
    id INTEGER PRIMARY KEY,
    product_id int(11) NULL,
    transaction_id int(11) NULL,
    qty int(11) NULL,
    subtotal varchar(255) NULL,
    created_at TIMESTAMP DATE DEFAULT (datetime('now','localtime')),
    CONSTRAINT fk_transaction_items_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE SET NULL,
    CONSTRAINT fk_transaction_items_product_with_size FOREIGN KEY (product_id) REFERENCES products_with_sizes (id) ON DELETE SET NULL
    );
```