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
  console.log("\nYou have connected sucessfully to the database!\n");
  login();
})

const login = () => {
  connection.query("SELECT * FROM employees", (error, employeeDb) => {

    inquirer.prompt([{
        name: "username",
        type: "input",
        message: "Welcome to Bamazon's Management System. Please enter your user credentials.",
        default: "admin" // maybe leave this out and make a mock database of users and passwords w/ validation...
      },
      {
        name: "password",
        type: "password",
        mask: true,
        message: "Please enter your password.",
        default: "admin"
      }
    ]).then((credentials) => {
      //validate if password is correct
      managerScreen();
    })

  })
}



const managerScreen = () => {
  inquirer.prompt([{
    name: "managerMenu",
    type: "list",
    message: "Please select any of the following options below.",
    choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"],
  }]).then(({managerMenu}) => {

    switch (managerMenu) {
      case "View products for sale":
        console.log("\n\n");
        viewProducts();
        break;

      case "View low inventory":
        console.log("\n\n");
        lowInventory();
        break;

      case "Add to inventory":
        addInventory();
        break;

      case "Add new product":
        console.log("\n\n");
        process.exit(0);
        break;

      default:
        console.log("\nExiting program....");
        console.log("\nBamazon Management System closed.")
        return process.exit(0);
    }
  })
}

const viewProducts = () => {
  connection.query("SELECT * FROM products", (error, productsDb) => {
    if (error) throw error;
    console.table(productsDb);
    
    inquirer.prompt([
      {
        name: "return2Menu",
        type: "input",
        message: "Press enter to return to the main page.\n"
      }
    ]).then((response) => {
      managerScreen();
    });
  });
}


const lowInventory = () => {
  connection.query("SELECT * FROM products WHERE stock_quantity < 2500", (error, productsDb) => {
    if (error) throw error;
    console.table(productsDb);

    inquirer.prompt([
      {
        name: "return2Menu",
        type: "input",
        message: "Press enter to return to the main page.\n"
      }
    ]).then((response) => {
      managerScreen();
    });

  });
}

const addInventory = () => {
  connection.query("SELECT * FROM products", (error, productsDb) => {
    inquirer.prompt([
      {
        name: "addingItems",
        type: "list",
        message: "Please select an item you wish to restock on.",
        choices: productsDb.map(products => products.item_id)
       },
       {
        name: "quantityAdded",
        type: "input",
        message: "How much of would you like to restock?",
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
        message: "Please verify that you want to go through with this order.",
        default: true
      }
    ]).then((response) => {
      switch (response.confirmation) {
        case true:
        //update following things with info from response to database.

        break;
      
        default:
        console.log("\n========= Your order has been cancelled. You will be brought back to the main menu. ========= \n");
        return managerScreen();
      }
    })



  })
}

const addProduct = () => {

}