DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id VARCHAR(10) NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price INTEGER(10) NOT NULL,
  stock_quantity INTEGER(10) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (123, "Silky Towels", "Tolietries", 17, 200);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (160, "Dentine Toothpaste", "Toiletries", 5, 1500);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (245, "Café Brasileiro", "Food", 9, 4500);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (250, "Everlasting Baked Beans", "Food", 6, 25000);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (277, "Mango Habenero Salsa", "Food", 10, 575);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (500, "Orange ePhones", "Eletronics", "1200", 8750);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (574, "Mvidya T2000 Cards", "Eletronics", 899, 3500);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (588, "Spooktacles", "Eletronics", 350, 12000); /* 🤮 */

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (730, "Baseball Bat", "Outdoors", 23, 3000);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (760, "Fishing Rod", "Outdoors", 45, 200);

