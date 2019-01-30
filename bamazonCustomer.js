require("dotenv").config();

const inquirer = require("inquirer");
var mysql = require("mysql");
var conTable = require("console.table");

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.user,
  password: process.env.pass,
  database: 'bamazon'
});

connection.connect(function (error) {
  if (error) throw error;
  console.log("You have connected sucessfully to the database!");
  buyMenu();
})

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
        
        var stockLeft = itemBought.stock_quantity - response.quantity;
        
        const updatedStock = {
          stock_quantity: stockLeft
        }

        const itemWhere = {
          item_id: itemBought.item_id
        }
        
        //MAKE A QUERY TO UPDATE SQL DATABASE TO REFLECT PURCHASE CHANGES
        const query = connection.query("UPDATE products SET ? WHERE ?", [updatedStock, itemWhere], function (error, productsDb) {
          if (error) throw error;
          
          console.log(`\nYour total will be $${purchaseTotal}.`);
          console.log(`\nThank you for purchasing at Bamazon. Please come again soon.`);
          process.exit(0);
        })
         
        } else {
          console.log("Your order exceeds the amount we currently have.");
          return buyMenu();
        }
        break;
      
        default:
        console.log("\n========= Your transaction has been cancelled. You will be brought back to the main menu. ========= \n");
        return buyMenu();
      }
    });
  })
}

