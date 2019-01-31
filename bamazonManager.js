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
      // make recursive function and if password false 3x then system gets locked out.
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
        addProduct();
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
  connection.query("SELECT * FROM products WHERE stock_quantity < 1000", (error, productsDb) => {
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
    if (error) throw error;
    console.log("RESTOCK QUESTION");
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
    ]).then((refill) => {
      switch (refill.confirmation) {
        case true:
        //update following things with info from response to database.
        var itemSelected = productsDb.find(products => products.item_id === refill.addingItems);
        //console.log(itemSelected);
        //console.log(itemSelected.stock_quantity);

        var stockRefilled = itemSelected.stock_quantity += refill.quantityAdded;
        //console.log(stockRefilled);
        
        const updatedProduct = {
          stock_quantity: stockRefilled
        };

        const itemWhere = {
          item_id: itemSelected.item_id
        };

        const query = connection.query("UPDATE products SET ? WHERE ?", [updatedProduct, itemWhere], (error, productsDb) => {
          if (error) throw error;
          console.log(`\n\n\n${refill.quantityAdded} ${itemSelected.product_name} will be added to company inventory.`);
          console.log(`\nCurrent stock of ${itemSelected.product_name}: ${stockRefilled}.\n`);
          console.log(`Please press ↑ or ↓ to view selection screen again.\n\n\n\n\n`); // to make the screen less buggy
        });                                                                          //And make user interface less atrocious...

        managerScreen();
        break;
      
        default:
        console.log("\n========= Your order has been cancelled. You will be brought back to the main menu. ========= \n");
        return managerScreen();
      }
    });

  });
}

const addProduct = () => {
  //access product database
  connection.query("SELECT * FROM products", (error, productsDb) => {
    if (error) throw error;
    inquirer.prompt([
      { //ITEM ID IS NOT AN INTEGER. STUFF DIES WHEN I TRY TO MAKE IT SO
        name: "id",
        type: "input",
        message: "Please assign the product an id."
      },
      {
        name: "product",
        type: "input",
        message: "Please insert the name of the product."
      },
      {
        name: "department",
        type: "input",
        message: "Please insert the department where the product falls under."
      },
      {
        name: "price",
        type: "input",
        message: "Insert price for product.",
        validate: function(input) {
          return !isNaN(input);
        },
        filter: function(input) {
          return parseInt(input);
        }
      },
      {
        name: "stock",
        type: "input",
        message: "Add the current amount available of product to be sold.",
        validate: function(input) {
          return !isNaN(input);
        },
        filter: function(input) {
          return parseInt(input);
        }
      }
    ]).then((newStuff) => {

      const productEntry = {
        item_id: newStuff.id,
        product_name: newStuff.product,
        department_name: newStuff.department,
        price: newStuff.price,
        stock_quantity: newStuff.stock
      };
    
      const query = connection.query("INSERT INTO products SET ?", productEntry, (error, newEntry2Db) => {
        if (error) throw error;
        console.log(`\n${newEntry2Db.affectedRows} new product added to Bamazon!\n`);

        managerScreen();
      });
    });
  });
}