// customController.js
var express = require("express");
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//CORS middleware Cross-Origin Resource Sharing 

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

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);

/*
//functional support
function containsIllegalInput(x) {
  //console.log(x);
  return (!x);
} */


//
module.exports = 
{
    fetchCustomerProfileData: async function(req, res) {
          let base_query = 'SELECT * FROM customers WHERE accountname=' + "'" + req.body.username+ "'" + ';';
          await connection.query(base_query, function(error, results, fields){
          if ( error ){
              console.log("Error fetching data from db, reason: " + error);
              res.statusCode = 404;
              res.send(error);
            }
            else
            {
              res.statusCode = 200;
              res.send(results[0]);
            }
            
    });
    },  
    fetchOrdersForCustomer : async function (req,res,next) {
      let base_query = 'SELECT order_id, title, description, order_ordered_date, order_started_date, order_ready_date, order_accrej_date, workitemId, status, extra_information, order_price ';
      let base_query2 = 'FROM orders WHERE customerId = ?';

      let id = req.body.userId;
            await connection.query((base_query+base_query2), [id], function(error, results, fields){
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
    fetchAllCustomers : async function (req,res,next) {
      let base_query = 'SELECT * from customers;';
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
                console.log("fechtsOrdersForCustomer result: ", results);
                res.json(results);
              }
       });
    },
    fetchOffersForCustomer : async function (req,res,next) {
      //console.log('Offer-Fetching reqbody: ',req.body);
      
      let base_query = `SELECT * FROM offers WHERE offer_consumerId = ?;`
      let id = req.body.userId;
            await connection.query((base_query), [id], function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.statusCode = 404;
                res.send('error on server-side.');
              }
              else
              {
                res.statusCode = 200;
                res.json(results);
              }
       });
    },
    updateOrderInformation : async function(req,res,next) {
      req.checkBody('*').trim();
      req.checkBody('*').escape();
      console.log("REQBODY IN UPDATE ORDER INFO: ", req.body);
      const errors = req.validationErrors();
      const data = req.body;
      let replyObject = {
        status: false,
        statusCode: null,
        errorInformation: null
      }
      if(errors) {
        console.log("Error deleting data from db, reason: " + error);
        replyObject.status = false;
        replyObject.statuscode = 404;
        replyObject.errorInformation = "Validation error"; //unnecessary with trimmed/escaped
        res.json(replyObject);
      } else {
        let base_query = `UPDATE orders SET description="${data.description}", extra_information="${data.extra_information}", status="${data.status}", order_price=${req.body.order_price} WHERE order_id=${data.order_id};`
        await connection.query(base_query, 
            function(error, result, fields){
            if ( error ){
                console.log("Login DB-query Error: " + error);
                //Object sent to client.
                res.statusCode = 404;
                replyObject.status = false;
                replyObject.statusCode = res.statusCode;
                replyObject.errorInformation = "DB-Query error.";
                res.json(replyObject);
            }
            else
            {
              console.log("query res ===> ", result);  
              res.statusCode = 200;
                replyObject.status = true;
                replyObject.statusCode = res.statusCode;
                //console.log("returned object: ", replyObject);
                res.json(req.body);
            }  

            });
        }
    },
    updateOfferInformation : async function(req,res,next) {
      req.checkBody('*').trim();
      req.checkBody('*').escape();
      console.log("REQBODY IN UPDATE OFFER INFO: ", req.body);
      const errors = req.validationErrors();
      const data = req.body;
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
        let base_query = `UPDATE offers SET offer_title="${data.offer_title}", offer_desc="${data.offer_desc}", offer_extra_information="${data.offer_extra_information}", offer_status="${data.offer_status}", offer_cost=${data.offer_cost} WHERE offer_id=${data.offer_id};`
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
    updateCustomerProfile : async function(req,res, next) {
      req.checkBody('*').trim();
      req.checkBody('*').escape();
      const errors = req.validationErrors();
      const data = req.body;
      let replyObject = {
        status: false,
        statusCode: null,
        errorInformation: null
      }
      if(errors) {
        console.log("Error deleting data from db, reason: " + error);
        replyObject.status = false;
        replyObject.statuscode = 404;
        replyObject.errorInformation = "Validation error"; //unnecessary with trimmed/escaped
        res.json(replyObject);
      } else {
        let base_query = `UPDATE customers SET firstname='${req.body.firstname}', lastname='${req.body.lastname}',address='${req.body.address}',postal_code='${req.body.postal_code}', city='${req.body.city}', phone_number='${req.body.phone_number}' WHERE accountname='${req.body.accountname}' AND accountpassword='${req.body.accountpassword}';`;
        await connection.query(base_query, 
            function(error, result, fields){
            if ( error ){
                console.log("Login DB-query Error: " + error);
                //Object sent to client.
                res.statusCode = 404;
                replyObject.status = false;
                replyObject.statusCode = res.statusCode;
                replyObject.errorInformation = "DB-Query error.";
                res.json(replyObject);
            }
            else
            {
                res.statusCode = 200;
                replyObject.status = true;
                replyObject.statusCode = res.statusCode;
                //console.log("returned object: ", replyObject);
                res.json(req.body);
            }  

            });
        }
    },
    fetchCustomer: async function(req,res, next) {      
        req.checkBody('id').isNumeric(); // works
        req.sanitizeBody('email').trim();
        req.sanitizeBody('email').escape();
        req.checkBody('email').isEmail();
        
        //req.sanitizeBody('datum').toDate();
        console.log("after: ",req.body);
        let a = req.body.email;
        console.log("a: ",a);
        let errors = req.validationErrors();
        
        if(errors) {
            res.statusCode = 404;
            res.send('CustomerId only allows Integer!');
        } else {
            res.send('worked');
            //await querySql();
        }
        async function querySql() {
            let base_query = 'SELECT * FROM customers WHERE customer_id=' + req.params.id + ';';
            await connection.query(base_query, function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.send(error);
              }
              else
              {
                res.statusCode = 200;
                res.send(results);
              }
        });
        }
    },
    deleteCustomer: function(req, res) {
      console.log("------------------\nDELETE CUSTOMER\n", req.body);
      
      let cID = req.body.id;
      let customerDeletion = "DELETE FROM customers WHERE customer_id = " + cID + ";";
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
    createCustomer: function(req, res){
      //console.log("------------------");
      //console.log("CREATE Customer");
      //console.log("body : " + JSON.stringify(req.body));

      var keys = Object.keys(req.body);
      for( var i = 0,length = keys.length; i < length; i++ ) {
        temp = req.body[keys[i]];
        if(temp == "" || temp == null) {
            console.log("Achtung: " + keys[i] + " is undefined or empty.");
            res.statusCode = 418; //teapot
            res.send(error);
        }
      }
      let c = req.body;
      var a = [c.Name, parseInt(c.Phone_number), c.Address, parseInt(c.Postal_Code), c.City, c.Customer_Type];
      //console.log(a);
      connection.query("INSERT INTO customer(Name, Phone_Number, Address, Postal_Code, City, Customer_Type) VALUES (?, ?, ?, ?, ?,?);", a,
      function(error, results,fields){
        if ( error ){
          console.log("Error when inserting data to db, reason: " + error);
          res.json(error);
        }
        else
        {
          //console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          c.Name = results.Name;
          let creationObj = {
            "creationStatus" : "successful",
            "createdObject" : req.body
          } 
          res.json(creationObj);
        }
      })
      },
      updateCustomerData: function(req,results) {
        //console.log("Checking if cookies.dataVersion is up-to-date: v" + req.cookies.dataVersion);
        //check if shown Data-Version is equal to Server-Side Dataversion...
        if(req.cookies.dataVersion == assignment1_rest.dataVersion) {
          let sqlUpdateString= `UPDATE customer SET Name=?, Phone_Number=?, Address=?, Postal_Code=?, City=?, Customer_Type=? WHERE ID = ${req.params.id}`;
          let escapeArray = [req.body.Name, req.body.Phone_Number, req.body.Address, req.body.Postal_Code, req.body.City, Number(req.body.Customer_Type)];
          console.log(escapeArray);
          console.log(sqlUpdateString);
          
          
          if(escapeArray.some(containsIllegalInput) === false)
          {
            //input is good
            connection.query(sqlUpdateString, escapeArray, function(err,result,fields) {
              if(err) {
                //console.log(fields);
                console.log("Error in Update-SQL-Query: " + err);
                results.statusCode = 400;
                results.send(err);
              } else {
                assignment1_rest.dataVersion++;
                results.cookie("dataVersion", assignment1_rest);
                results.statusCode = 200;
                updatedObj = {
                  "updateStatus":"success",
                  "updatedObject": escapeArray
                }
                results.json(updatedObj);
              }
            });
          } else {
            //input is bad
            results.statusCode = 420;
            let err = new Error('Not all fields were entered!!!');
            console.log(err);
            results.send("ERROR: ### ILLEGAL INPUT ###");
        }
      } else {
        results.statusCode = 421;  
        let err = new Error('Dataversion might have changed. Please refresh Search results beforehand updating!');
        console.log(err);
        results.send("ERROR: # Aged Dataversion can not be updated.");
      }
      },
      getCustomer: function(req,res) {
        //console.log(">> GET Customer info for CustID: "+ req.params.id);
        let getSQLString = `SELECT customer.ID, customer.Name, customer.Phone_Number, customer.Address, customer.Postal_Code, customer.City, customer.Customer_Type, customer_types.Legend FROM customer INNER JOIN customer_types WHERE ID = ${req.params.id} AND customer.Customer_Type = customer_types.TypeID ;`;
        //SELECT * FROM `customer` INNER JOIN customer_types WHERE customer.ID = 1 AND customer.Customer_Type = customer_types.TypeID;
        //console.log("> " + getSQLString);
        connection.query(getSQLString, function(err,result,fields) {
          if(err) {
            console.log("Error in SQL-query + " + err);
            res.send(err);
          } else {
            res.statusCode = 200; //everything's fine
            res.send(result);
          }
        });
      },
      getCustomerForDelete: function(req,res, next) {
        console.log('getting cust for deletion');
        //console.log(">> GET Customer info for CustID: "+ req.params.id);
        let getSQLString = `SELECT customer.ID, customer.Name, customer.Phone_Number, customer.Address, customer.Postal_Code, customer.City, customer.Customer_Type, customer_types.Legend FROM customer INNER JOIN customer_types WHERE ID = ${req.params.id} AND customer.Customer_Type = customer_types.TypeID ;`;
        //SELECT * FROM `customer` INNER JOIN customer_types WHERE customer.ID = 1 AND customer.Customer_Type = customer_types.TypeID;
        //console.log("> " + getSQLString);
        connection.query(getSQLString, function(err,result,fields) {
          if(err) {
            console.log("Error in SQL-query + " + err);
            res.statusCode = 400;
            res.send(err);
          } else {
            req.params.customerData = result;
            res.locals.customerData = result;
            console.log("result in getcustinfo");
            console.log(result);
            next();
          }
        });
      },
    addPhoneToBlocked: function(req,res, next){
        /*console.log("adding phone number...customerdata:");
        console.log(res.locals.ID);
        
        //Date Object manipulation
        function twoDigits(d) {
          if(0 <= d && d < 10) return "0" + d.toString();
          if(-10 < d && d < 0) return "-0" + (-1*d).toString();
          return d.toString();
        }
        Date.prototype.toMySQLFormat = function() {
          return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate());
        }
        
        var myDate = new Date();
        /*myDate = myDate.setMonth(myDate.getMonth() + 6);
        myDate = myDate.toMySQLFormat;
        let futureUnix = new Date(myDate.setMonth(myDate.getMonth() + 6)).toMySQLFormat();
        console.log("myDate: " + futureUnix);
        let addBlockedNumberSQL =  `INSERT INTO blocked_phone_numbers (Phone_Number, Previous_Owner, Free_to_be_used) VALUES(${req.params.customerData[0].Phone_Number},"${req.params.customerData[0].Name}","${futureUnix}");`
        console.log(addBlockedNumberSQL);
        connection.query(addBlockedNumberSQL, (err, result, fields) => {
          if(err) {
            console.log("Error in SQL-query + " + err);
            res.statusCode = 400;
            res.send(err);
          } else {
            console.log(result);
            next();
          }
        })*/
      }
}   
// middleware

// make the localhost listen to further instructions/input



/*
function getFullString(preparedStatement,queryObj) {
  let whereSelection = "";
  let andCounter = 0;

  if((queryObj.id =="") && (queryObj.name == "") && (queryObj.address == "") && (queryObj.customer_type == 0)) {
    //console.log("##############################");
    return (preparedStatement + "1");
  } else {
      //console.log("Sufficient filters!!!!!!!!")
      for (var key in queryObj){
      var attrName = key;
      var attrValue = queryObj[key];
      if(andCounter>0) {
        whereSelection += " AND ";
      }
      switch(attrName) {
        case "id":
          if(attrValue=="") {
            whereSelection += " 1=1 ";
            andCounter++;
            continue;
          } else {
            whereSelection += " ID = " + connection.escape(queryObj[key]);
            andCounter++;
          }
          //testPrint(attrName, attrValue);
          break;
        case "name":
            if(attrValue=="") {

              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Name = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            //testPrint(attrName, attrValue);
          break;
        case "address":
            if(attrValue=="") {

              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Address = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            //testPrint(attrName, attrValue);
          break;
        case "customer_type":
            if(attrValue==0) {
  
              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Customer_Type = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            //testPrint(attrName, attrValue);
          break;  
      }
  }
  let result = (preparedStatement + whereSelection + ";");
  return (result);
  }
}
*/


/*'use strict'

var mysql = require('mysql');


module.exports = 
{
    fetchAll: function(req, res){
      console.log("HELLLLLLLLLLLLLLL");  
      let condition = {};
        Student.find(function(err, cust) {
            if (err)
              res.send(err);

            res.json(cust);
          });
        
       res.send('hallo');
    },
    fetchAllNew: function(req,res) {
      return new Promise((resolve, reject) => {
        //console.log("query : " + query );
        console.log("Query: ");
        Student.find(function(err, cust) {
          if (err) {
            console.log(err);
            reject("error fetching data from mongoDB");
          } else {
            console.log(cust);
            resolve(cust);
          }
        });
      })  
    },
    fetchAllFiltered: function(req,res) {
      return new Promise((resolve, reject) => {
        //adjust logic
        //console.log("query : " + query );
        
        let numVar;
        let nameVar;
        let condition = [];
        let conditionObj = {}
        if(req.body.studentnumber != '' && req.body.studentnumber != 'undefinded') {
          conditionObj['studentnumber'] = req.body.studentnumber;
        }
        if(req.body.name != '' && req.body.name != 'undefined') {
          conditionObj['name'] = req.body.name;
        }

        Student.find( conditionObj ,function(err, cust) {
          if (err) {
            console.log(err);
            reject("error fetching data from mongoDB");
          } else {
            console.log(cust);
            resolve(cust);
          }
        });
      })  
    },
    createPrototypeStudent : function(req,res){
      return new Promise((resolve, reject)=> {
        console.log("########################\nReqBody:",req.body);
        var new_c = new Student(req.body);
  
        console.log(req.body);
        console.log("loggin new Student", new_c);
        new_c.save(function(err, student) {
          if (err) {
            reject(err);
          } 
            resolve();
          });
      })
    },

    create : function(req,res){
      var new_c = new Student(req.body);
      console.log(new_c);
      new_c.save(function(err, student) {
        if (err)
          res.send(err);
        
        res.statusCode = 201;
        res.json(new_c);
      });
    },

    update: function(req, res){
        Customer.findOneAndUpdate({_id: req.params.studentid}, req.body, {new: true}, function(err, student) {
            if (err)
              res.send(err);

            res.statusCode = 204;
            res.send();
          });
        
    },
    delete: function(req, res){
      Student.deleteOne({
            _id: req.params.studentid
          }, function(err, cust) {
            if (err)
              res.send(err);
            res.json({ message: 'Student successfully deleted' });
            res.statusCode = 204;
            res.send();
          });
    }
}
*/