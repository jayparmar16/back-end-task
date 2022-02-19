const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
var sqlConfig = require('./config/conn')
//console.log(sqlConfig)

// create express app
const app = express();
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

/* ######## CUSTOMER API ENDPOINTS ########## */ 

// ADD CUSTOMER DETAILS - POST Request
app.post('/add_customer', function (req, res) {
    const customer_name = req.body.Customer_Name;
    const email = req.body.Email;
    const mobile = req.body.Mobile_Number;
    const city = req.body.City;
    const Customer_ID = uuidv4();

    // connect to database
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(`INSERT INTO Customer VALUES ('${customer_name}','${email}','${mobile}','${city}','${Customer_ID}');`, function (err, recordset) {
            if (err) console.log(err)

            // test
            res.status(200).json({recordset: recordset});
            
        });
    });
});

// GET ALL CUSTOMERS - Get Request
app.get('/customers', function(req, res) {
    sql.connect(sqlConfig, function(err){
        if(err) console.log(err);

        var request = new sql.Request();
        request.query(`SELECT * FROM Customer`, function(err, recordset){
            if(err) console.log(err);

            res.send(recordset['recordsets']);
        });
    });
});


/* ######## PURCHASE ORDER API ENDPOINTS ########## */ 

// CREATE A PURCHASE ORDER - Post Request
app.post('/create_order', function (req, res){
    const product = req.body.Product_Name;
    const quantity = req.body.Quantity;
    const pricing = req.body.Pricing;
    const MRP = req.body.MRP;
    const Order_ID = uuidv4();
    const Customer_ID = req.body.Customer_ID;

    if (pricing < MRP){
    // connect to DB
        sql.connect(sqlConfig, function (err){
            if(err) console.log(err);

            var request = new sql.Request();
            //query
            request.query(`INSERT INTO Purchase_Orders VALUES ('${product}','${quantity}','${pricing}','${MRP}','${Order_ID}','${Customer_ID}');`, function (err, recordset){
                if(err) console.log(err);

                res.status(200).json({recordset: recordset});
            });
        });
    }
    else{
        res.status(404).send("Pricing can't be greater than MRP")
    }
});

// GET ALL PURCHASE_ORDERS - GET Request
app.get('/orders',function (req, res){
    sql.connect(sqlConfig, function(err){
        if(err) console.log(err);

        var request = new sql.Request();
        request.query(`SELECT * FROM Purchase_Orders`, function(err, recordset){
            if(err) console.log(err);

            res.send(recordset['recordsets']);
        });
    });
});

/* ######## SHIPPING DETIALS API ENDPOINTS ########## */ 

// CREATE A SHIPPING DETAIL - Post Request
app.post('/create_shipping', function (req, res){
    const address = req.body.Address;
    const city = req.body.City;
    const PINCODE = req.body.PINCODE;
    const Order_ID = req.body.Purchase_Order_ID;
    const Customer_ID = req.body.Customer_ID;

    // connect to DB
    sql.connect(sqlConfig, function (err){
        if(err) console.log(err);

        var request = new sql.Request();
        //query
        request.query(`INSERT INTO Shipping_Details VALUES ('${address}','${city}','${PINCODE}','${Order_ID}','${Customer_ID}');`, function (err, recordset){
            if(err) console.log(err);

            res.status(200).json({recordset: recordset});
        });
    });
});

// GET ALL SHIPPING DETAIL ORDERS - Get Request
app.get('/shipping_orders',function (req, res){
    sql.connect(sqlConfig, function(err){
        if(err) console.log(err);

        var request = new sql.Request();
        request.query(`SELECT * FROM Shipping_Details`, function(err, recordset){
            if(err) console.log(err);

            // send records as a response
            res.send(recordset['recordsets']);
        });
    });
});


// API to get Shipping Details of all customers in a particular city
app.get('/shipment_citywise',function (req, res){
    city = req.body.city;
    sql.connect(sqlConfig, function (err){
        if(err) console.log(err);

        var request = new sql.Request();
        request.query(`SELECT * FROM Shipping_Details WHERE City='${city}'`, function (err, recordset){
            if(err) console.log(err);
            
            res.send(recordset['recordsets']);
        });
    });
});

// // API to get customer with purchase orders
// app.get('/customer_purchase_orders',function (req, res){    
//     sql.connect(sqlConfig, function (err){
//         if(err) console.log(err);

//         var request = new sql.Request();
//         request.query(`SELECT * FROM Purchase_Orders'`, function (err, recordset){
//             if(err) console.log(err);
            
//             res.send(recordset['recordsets']);
//         });
//     });
// });


// listen for requests
PORT = '3000';
app.listen(PORT, () => {
    console.log(`Server is listening on port `+PORT);
});