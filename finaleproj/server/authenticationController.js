var express = require("express");
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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
    registerCustomer: async function(req, res) {
        //res.cookie("dataVersion", assignment1_rest.dataVersion);
        console.log('REQ BODY',req.body);
        let base_query = 'INSERT INTO customers (firstname, lastname, address, postal_code, city, phone_number, accountname, accountpassword, accounttype) VALUES(?,?,?,?,?,?,?,?,?)';
        let c = req.body;
        let data = [c.firstname, c.lastname, c.address, c.postal_code, c.city, c.phone_number, c.accountname, c.accountpassword, "customer"]; //
        let replyObject = {
            status: false,
            statusCode: null,
            errorInformation: null
        }
        await connection.query(base_query, data,
            function(error, result, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                //Object sent to client.
                res.statusCode = 404;
                replyObject.status = false;
                replyObject.statusCode = result.statusCode;
                replyObject.errorInformation = error;
                console.log(replyObject);
                res.json(replyObject);
              }
              else
              {
                result.statusCode = 200;
                replyObject.status = true;
                replyObject.statusCode = result.statusCode;
                console.log('replyObj: ', replyObject);
                res.json(replyObject);
              }
        });

    },
    loginAuthentication: async function(req,res) {
        console.log("REQ-BODY: ", req.body);
        let replyObject = {
            status: false,
            statusCode: null,
            errorInformation: null,
            type: null
        }
        req.sanitizeBody('username').escape();
        req.sanitizeBody('username').trim();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('password').trim();


        let resultNumber= null;
        let valErrors = req.validationErrors();
        if(valErrors) {
            res.statusCode = 404;
            replyObject.status = false;
            replyObject.statusCode = res.statusCode;
            replyObject.errorInformation = "Sanitization Error!" + valErrors;
            res.json(replyObject);
        } else {
            let c = [req.body.username, req.body.password]
            let base_query = `SELECT * FROM customers WHERE accountname="${c[0]}" AND accountpassword="${c[1]}";`;
            await connection.query(base_query, c,
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
                    if(result.length === 0) {
                        res.statusCode = 200;
                        replyObject.status = false;
                        replyObject.statusCode = res.statusCode;
                        replyObject.errorInformation = "Username and password do not match!";
                        res.json(replyObject);
                    } else {
                        //console.log("Accounttype: ",result[0].accounttype);
                        //console.log("Customer_Id: ",result[0].customer_id);
                        res.statusCode = 200;
                        replyObject.status = true;
                        replyObject.statusCode = res.statusCode;
                        replyObject.type = result[0].accounttype;
                        replyObject.customer_id = result[0].customer_id;
                        res.json(replyObject);
                    }    
                }
                
            });
            
        }   
    
    }
}