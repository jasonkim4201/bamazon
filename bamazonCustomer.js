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
     },
     {
       name: "confirmation",
       type: "confirm",
       message: "Are you sure you want to confirm with your transaction?",
       default: true
     }
    ]).then((response) => {
      switch (response.confirmation) {
        case true:  
        
        var itemBought = productsDb.find(products => products.item_id === response.listedItems);
        console.log(`\nYou are attempting to buy ${response.quantity} ${itemBought.product_name}.`);
      
        //check to see if there is enough for purchase

        if (response.quantity < itemBought.stock_quantity) {
        //calculate total price and subtract from stock_quantity
        console.log("\nProcessing order...");
        
        var purchaseTotal = response.quantity * itemBought.price;
        console.log(`\nYour total will be $${purchaseTotal}.`);
        
        itemBought.stock_quantity -= response.quantity;
        console.log(`\n${itemBought.product_name} left: ${itemBought.stock_quantity}`);
        
        //MAKE A QUERY TO UPDATE SQL DATABASE TO REFLECT PURCHASE CHANGES

        connection.end();
         
        } else {
          console.log("Your order exceeds the amount we currently have.");
          return buyMenu();
        }

        break;
      
        default:
        console.log("\n========= Your transaction has been cancelled. You will be brought back to the main menu. ========= \n");
        return buyMenu();
      }

    }) // end of .then bracket

   //end of query brackets 
  })
}//end of original curly bracket

