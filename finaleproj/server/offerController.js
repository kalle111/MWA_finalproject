// offerController.js
var express = require("express");
var app = express();
var expressValidator = require('express-validator');
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
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(expressValidator());

//sql connection --change user before production
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',  
  password : '',
  database : 'finalproject',
  multipleStatements: false // Security reasons => sql injection risk.
});

module.exports = 
{
  fetchOffersForAllCustomers: async function(req, res, next) {
    //let base_query = 'SELECT orders.order_id, orders.customerId, customers.lastname, customers.firstname, orders.title, orders.description, orders.order_ordered_date, orders.order_started_date, orders.order_ready_date, orders.order_accrej_date, orders.workitemId, orders.status, orders.extra_information, orders.order_price ';
    //let base_query2 = 'FROM orders LEFT JOIN customers ON orders.customerId = customers.customer_id;';

    let base_query = `SELECT offers.offer_id, offers.offer_consumerId, customers.lastname, customers.firstname, offers.offer_title, offers.offer_desc, offers.offer_cost, offers.offer_extra_information, offers.datetime_requested, offers.datetime_aswered, offers.datetime_accepted_rejected, offers.offer_status FROM offers LEFT JOIN customers ON offers.offer_consumerId = customers.customer_id;`;
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
updateOfferInformationAnswer: async function(req,res,next) {
      req.checkBody('*').trim();
      req.checkBody('*').escape();
      console.log("REQBODY IN UPDATE OFFER INFO: ", req.body);
      const errors = req.validationErrors();
      const data = req.body;
      let dt = new Date();
      let resObject = {
        success: null,
        res: null,
        statusCode: null,
        errorInformation: null
      }
      if(errors) {
        console.log("Error deleting data from db, reason: " + error);
        resObject.success = false;
        resObject.statuscode = 400;
        resObject.res = errors;
        resObject.errorInformation = "Validation error"; //unnecessary with trimmed/escaped
        res.json(resObject);
      } else {
        let base_query = `UPDATE offers SET offer_title="${data.offer_title}", offer_desc="${data.offer_desc}", offer_extra_information='${data.offer_extra_information}', offer_status= 'ANSWERED', offer_cost=${data.offer_cost}, datetime_aswered= NOW() WHERE offer_id=${data.offer_id};`
        console.log(base_query);
        await connection.query(base_query, 
            function(error, results, fields){
            if ( error ){
                res.statusCode = 404;
                res.statusCode = 404;
                resObject.success = false;
                resObject.statusCode = res.statusCode;
                resObject.res = results;
                resObject.errorInformation = error;
                res.status(404).json(resObject);
            }
            else
            {
              console.log(results);
              res.statusCode = 200;
              resObject.success = true;
              resObject.statusCode = res.statusCode;
              resObject.res = results;
              resObject.errorInformation = error;
              res.status(200).json(resObject);
            }  

            });
        }
},
fetchOffersForAllCustomersFiltered: async function(req, res, next) {
  console.log("offers for all customers - filtered : ", req.body);
  //let base_query = 'SELECT * FROM (SELECT orders.order_id, orders.customerId, customers.lastname, customers.firstname, orders.title, orders.description, orders.order_ordered_date, orders.order_started_date, orders.order_ready_date, orders.order_accrej_date, orders.workitemId, orders.status, orders.extra_information, orders.order_price ';
  //let base_query2 = `FROM orders LEFT JOIN customers ON orders.customerId = customers.customer_id)AS table1 WHERE 1=1`;


  let base_query = `SELECT * FROM (SELECT offers.offer_id, offers.offer_consumerId, customers.lastname, customers.firstname, offers.offer_title, offers.offer_desc, offers.offer_cost, offers.offer_extra_information, offers.datetime_requested, offers.datetime_aswered, offers.datetime_accepted_rejected, offers.offer_status FROM offers LEFT JOIN customers ON offers.offer_consumerId = customers.customer_id) AS table1 WHERE 1=1`;
  
  if(req.body.id != undefined && req.body.id != '') {
    base_query += ` AND table1.offer_consumerId = ${req.body.id}`;
  }
  if(req.body.ln != undefined && req.body.ln != '' ) {
    base_query += ` AND table1.lastname = "${req.body.ln}"`;
  }
  if(req.body.stat != undefined && req.body.stat != '' && req.body.stat != '0') {
    base_query += ` AND table1.offer_status = "${req.body.stat}"`;
  }
  console.log(base_query);
      await connection.query((base_query), function(error, results, fields){
        if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.statusCode = 404;
            res.send('error on server-side.');
          }
          else
          {
            res.statusCode = 200;
            console.log("offer filter result: ", results);
            res.json(results);
          }
   });

}, 
deleteOffers: function(req, res) {
  console.log("------------------\nDELETE Offers\n", req.body);
  
  let cID = req.body.id;
  let customerDeletion = "DELETE FROM offers WHERE offer_consumerId = " + cID + ";";
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
statusPreFetch: async function(req, res, next) {
  let base_query = 'SELECT * FROM offer_status;';
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
addNewOffer: async function(req, res) {
    //res.cookie("dataVersion", assignment1_rest.dataVersion);
    console.log(req.body);
    let base_query = 'INSERT INTO offers (offer_title, offer_desc, offer_consumerId, offer_cost, offer_status, offer_extra_information, datetime_requested) VALUES (?,?,?,?,?,?,?)';
    let dt = new Date();
    let c = [req.body.offer_title, req.body.offer_desc, req.body.offer_consumerId, null, 'REQUESTED', req.body.offer_extra_information, dt];
    let resObject = {
      success: null,
      res: null,
      statusCode: null,
      errorInformation: null
    }
    await connection.query(base_query,c, 
      function(error, results, fields){
        if ( error ){
            console.log("Error fetching order-data from db, reason: " + error);
            res.statusCode = 500;
            res.data = results;
            res.statusCode = 500;
            resObject.success = false;
            resObject.statusCode = res.statusCode;
            resObject.res = results;
            resObject.errorInformation = error;
            res.status(500).json(resObject);
          }
          else
          {
            console.log(results);
            res.statusCode = 200;
            res.data = results;
            
            resObject.success = true;
            resObject.statusCode = res.statusCode;
            resObject.res = results;
            resObject.errorInformation = error;
            res.status(200).json(resObject);
          }
    });
    },
    acceptRejectStatusUpdate : async function (req, res) {
      console.log(req.body);
      let base_query = `UPDATE offers SET datetime_accepted_rejected = NOW(), offer_status = '${req.body.type}' WHERE offer_id = ${req.body.offer.offer_id};`;
      let resObject = {
        success: null,
        res: null,
        statusCode: null,
        errorInformation: null
      }
      await connection.query(base_query,
        function(error, results, fields){
          if ( error ){
              console.log("Error while accepting Offer. reason: " + error);
              res.statusCode = 400;
              res.data = results;
              res.statusCode = 400;
              resObject.success = false;
              resObject.statusCode = res.statusCode;
              resObject.res = results;
              resObject.errorInformation = error;
              res.status(400).json(resObject);
            }
            else
            {
              console.log(results);
              res.statusCode = 200;
              res.data = results;
              
              resObject.success = true;
              resObject.statusCode = res.statusCode;
              resObject.res = results;
              resObject.errorInformation = error;
              res.status(200).json(resObject);
            }
      });
    },
    deleteOffer: async function (req,res) {
    console.log(req.body);
    let base_query =  `DELETE from offers WHERE offer_id = ${req.body.offer_id}`;
    let resObject = {
      success: null,
      res: null,
      statusCode: null,
      errorInformation: null
    }
    await connection.query(base_query, 
      function(error, results, fields){
        if ( error ){
            console.log("Error fetching order-data from db, reason: " + error);
            res.statusCode = 404;
            res.data = results;
            resObject.success = false;
            resObject.statusCode = 404;
            resObject.res = results;
            resObject.errorInformation = error;
            res.status(404).json(resObject);
          }
          else
          {
            console.log(results);
            res.statusCode = 200;
            res.data = results;

            resObject.success = true;
            resObject.statusCode = res.statusCode;
            resObject.res = results;
            resObject.errorInformation = error;
            
            res.status(200).json(resObject);
          }
    });
  
  }
}   
// middleware

// make the localhost listen to further instructions/input

