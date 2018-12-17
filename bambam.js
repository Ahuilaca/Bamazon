// Use NPM packages=====================================
var inquirer = require("inquirer");
var mysql = require("mysql");

// Connect to mySQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "ahuilaca",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    createTable();

});

// Displays items for sale===============================
var createTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + ". " + res[i].product_name + " / " + res[i].department_name + " / " + res[i].price + " / " + res[i].stock_quantity);
            console.log("--------------------------------------------");
        }
        purchasePrompt();
    })
}

// Place orders here======================================
var purchasePrompt = function () {
    console.log("--~~Place your Order Here!~~--");
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "What product would you like to purchase?"
        },
        {
            type: "input",
            //name: "stock_quantity",
            name: "quantity",
            message: "How many would you like to purchase?"


        }]).then(function (input) {
            var item = input.product_name;
            //var quantity = input.quantity;
            var quantity = input.products;

            // To confirm item exists in the desired quantity
            var Selection = "SELECT * FROM products WHERE ?";

            connection.query(Selection, { product_name: item }, function (err, data) {
                if (err) throw err;
                if (data.length === 0) {
                    console.log("Sorry, we do not carry that item. Please make another selection.");


                    // Fix from here
                } else {
                    //var productInfo = data[0];
                    var itemInfo = data;
                    // If the quantity requested is in stock
                    if (quantity <= itemInfo.stock_quantity) {
                        console.log("Your order has been placed.");

                        // Updating
                        var updateSelection = "UPDATE products SET stock_quantity = " + (itemInfo.stock_quantity - quantity) + " WHERE product_name = " + item;

                        // Update the inventory
                        connection.query(updateSelection, function (err, data) {
                            if (err) throw err;

                            console.log("Thank you for your order! Your total is $" + itemInfo.price * quantity);
                            console.log("-----------------------------------");

                            // End the database connection
                            //connection.end();
                        })
                    } else {
                        console.log("Sorry, due to low inventory your order cannot be completed at this time.");
                        //                         console.log("-----------------------------------");
                    }
                }
            })
        })
}