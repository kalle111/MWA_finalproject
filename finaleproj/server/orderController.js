// orderController.js
var express = require("express");
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var assignment1_rest = require('./assignment1_rest');
//Required in both .js files apparently
//CORS middleware Cross-Origin Resource Sharing 

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());



var mysql = require('mysql');

var connection = mysql.createConnection({
host     : '127.0.0.1',
user     : 'root',  // Note! Do not use root credentials in production!
password : '',
database : 'finalproject',
multipleStatements: false // Security reasons => sql injection risk.
});


/*
//functional support
function containsIllegalInput(x) {
  //console.log(x);
  return (!x);
} */

//
module.exports = 
{
  fetchOrdersForAllCustomers: async function(req, res, next) {
    let base_query = 'SELECT orders.order_id, orders.customerId, customers.lastname, customers.firstname, orders.title, orders.description, orders.order_ordered_date, orders.order_started_date, orders.order_ready_date, orders.order_accrej_date, orders.workitemId, orders.status, orders.extra_information, orders.order_price ';
    let base_query2 = 'FROM orders LEFT JOIN customers ON orders.customerId = customers.customer_id;';
          await connection.query((base_query+base_query2), function(error, results, fields){
          if ( error ){
              console.log("Error fetching data from db, reason: " + error);
              res.statusCode = 404;
              res.send('error on server-side.');
            }
            else
            {
              res.statusCode = 200;
              //console.log("fechtsOrdersForCustomer result: ", results);
              res.json(results);
            }
     });
}, 
fetchOrdersForAllCustomersFiltered: async function(req, res, next) {
  console.log("orders for all customers - filtered : ", req.body);
  let base_query = 'SELECT * FROM (SELECT orders.order_id, orders.customerId, customers.lastname, customers.firstname, orders.title, orders.description, orders.order_ordered_date, orders.order_started_date, orders.order_ready_date, orders.order_accrej_date, orders.workitemId, orders.status, orders.extra_information, orders.order_price ';
  let base_query2 = `FROM orders LEFT JOIN customers ON orders.customerId = customers.customer_id)AS table1 WHERE 1=1`;
  
  if(req.body.id != undefined && req.body.id != '') {
    base_query2 += ` AND table1.customerId = ${req.body.id}`;
  }
  if(req.body.ln != undefined && req.body.ln != '' ) {
    base_query2 += ` AND table1.lastname = "${req.body.ln}"`;
  }
  if(req.body.stat != undefined && req.body.stat != '' && req.body.stat != '0') {
    base_query2 += ` AND table1.status = "${req.body.stat}"`;
  }
      await connection.query((base_query+base_query2), function(error, results, fields){
        if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.statusCode = 404;
            res.send('error on server-side.');
          }
          else
          {
            res.statusCode = 200;
            //console.log("fechtsOrdersForCustomer result: ", results);
            res.json(results);
          }
   });

},
startOrder: async function(req, res, next) {
  let base_query = `UPDATE orders SET order_started_date = NOW(), status = 'STARTED' WHERE order_id = ${req.body.order_id};`;
        await connection.query((base_query), 
          function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.statusCode = 404;
                res.send('error on server-side.');
              }
              else
              {
                res.statusCode = 200;
                //console.log("fechtsOrdersForCustomer result: ", results);
                res.json(results);
              }
   });
},
finishOrder: async function(req, res, next) {
  let base_query = `UPDATE orders SET order_ready_date = NOW(), status = 'READY' WHERE order_id = ${req.body.order_id};`;
        await connection.query((base_query), 
          function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.statusCode = 404;
                res.send('error on server-side.');
              }
              else
              {
                res.statusCode = 200;
                //console.log("fechtsOrdersForCustomer result: ", results);
                res.json(results);
              }
   });
},  
statusPreFetch: async function(req, res, next) {
  let base_query = 'SELECT * FROM order_status;';
        await connection.query((base_query), function(error, results, fields){
        if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.statusCode = 404;
            res.send('error on server-side.');
          }
          else
          {
            res.statusCode = 200;
            console.log("fechtsOrdersForCustomer result: ", results);
            res.json(results);
          }
   });

},  
deleteOrders: function(req, res) {
  console.log("------------------\nDELETE ORDERS\n", req.body);
  
  let cID = req.body.id;
  let customerDeletion = "DELETE FROM orders WHERE customerId = " + cID + ";";
  //console.log("Now starting delete of customer nr. "+ cID);
  connection.query(customerDeletion, function(error, results, fields){
    if ( error ){
        console.log("Error deleting data from db, reason: " + error);
        deletionObj = {
          "deletion" : "error",
          "errorInfo" : error
        }
        res.json(error);
      }
      else
      {
        res.statusCode = 200; //no content as response.
        deletionObj = {
          "deletion" : "success",
          "deletedObject" : req.body
        }
        res.json(deletionObj);
      }
  });
},
  addNewOrder: async function(req, res) {
        //res.cookie("dataVersion", assignment1_rest.dataVersion);
        console.log("item that should be a new order: ", req.body);
        let base_query = 'INSERT INTO orders (title, description, order_ordered_date, workItemId, customerId, order_price, status, extra_information) VALUES (?,?,?,?,?,?,?,?)';
        let dt = new Date();
        let c = [req.body.title, req.body.description, dt, req.body.workitem_id, req.body.customerId, req.body.price, 'ORDERED', req.body.extra_information];
        console.log(c);
        let resObject = {
          status: false,
          statusCode: null,
          data: null,
          errorInformation: null
        }
         await connection.query(base_query,c, 
          function(error, results, fields){
            if ( error ){
                console.log("Error fetching order-data from db, reason: " + error);
                res.statusCode = 404;
                //res.send("An error occured, please contact your local admin, Error" + res.statusCode);
                resObject.status = false;
                resObject.statusCode = 404;
                resObject.data = results;
                resObject.errorInformation = error;
                res.status(404).json(resObject);
              }
              else
              {
                res.statusCode = 200;
                resObject.status = true;
                resObject.statusCode = 200;
                resObject.data = results;
                resObject.errorInformation = null;
                console.log("New Order: ", results);
                res.status(200).json(resObject);
                //res.json("results");
              }
        });
    },
    deleteOrder: async function(req,res) {
      let order_id = req.body.order_id;
      let base_query = 'DELETE FROM orders WHERE order_id = ?';
      await connection.query(base_query, [order_id],
        function(error, results, fields) {
          if ( error )  {
            console.log(`An error while deleting order ${order_id} occured!`);
            res.statusCode = 404;
            res.json("An error occured, please contact your local admin, Error" + res.statusCode);
          } else {
            res.statusCode = 200;
            res.json("success");
          }
        }); 
    },
    acceptRejectStatusUpdate : async function(req,res) {
      console.log(req.body);
      let base_query = `UPDATE orders SET order_accrej_date = NOW(), status = '${req.body.type}' WHERE order_id = ${req.body.order_id};`;
      console.log(base_query);
      await connection.query(base_query,
        function(error, results, fields) {
          if ( error )  {
            console.log(`An error while setting accrej_date for order ${req.body.order_id} occured!`);
            res.statusCode = 404;
            res.json("An error while setting accrej_date occured, please contact your local admin, Error" + res.statusCode);
          } else {
            res.statusCode = 200;
            res.json("success");
          }
        }); 

    }
}   
// middleware

// make the localhost listen to further instructions/input

