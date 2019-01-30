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

--employees table
USE bamazon;

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INTEGER(6) NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  username VARCHAR(30) NOT NULL,
  password VARCHAR(40) NOT NULL,
  PRIMARY KEY (id)
);
