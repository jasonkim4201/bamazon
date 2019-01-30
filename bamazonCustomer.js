require("dotenv").config();

const inquirer = require("inquirer");
var mysql = require("mysql");
var conTable = require("console.table");

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.user,
  password: process.env.pass, //insert password and maybe put it into an env file.
  database: 'bamazon' //insert database name here.
});

connection.connect(function (error) {
  if (error) throw error;
  console.log("You have connected sucessfully to the database!");
  buyMenu();
})
// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.


const buyMenu = () => {
  //GET LISTED PRODUCTS FROM SQL DATABASE
  connection.query("SELECT * FROM products", (error, productsDb) => {
    if (error) throw error;
  //USE INQUIRER TO LIST PRODUCTS
    console.table(productsDb);
    
    inquirer.prompt([
     {
      name: "listedItems",
      type: "list",
      message: "Welcome to Bamazon. Please select an item by the item id to make a purchase.",
      choices: productsDb.map(products => products.item_id)
     },
     {
       name: "quantity",
       type: "input",
       message: "How much of would you like to purchase?",
       validate: function (input) {
         return !isNaN(input);
       },
       filter: function(input) {
         return parseInt(input);
       }
     }
    ]).then(({listedItems, quantity}) => {
      connection.end()
    })

   //end of query brackets 
  })
}//end of original curly bracket