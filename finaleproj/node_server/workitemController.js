// workitemController.js
var express = require("express");
var app = express();
var expressValidator = require('express-validator');

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

/*
//functional support
function containsIllegalInput(x) {
  //console.log(x);
  return (!x);
} */

//
module.exports = 
{
    fetchAllWorkItems: async function(req, res) {
        //res.cookie("dataVersion", assignment1_rest.dataVersion);
        let replyObject = {
          status: false,
          statusCode: null,
          errorInformation: null, 
          results: null
        }
        let base_query = 'SELECT workitem_id, title, description, price FROM workitems WHERE prior_offer_required IS NULL;';
        console.log(base_query);
         await connection.query(base_query, function(error, results, fields){
            if ( error ){
                console.log("Error fetching workitem-data from db, reason: " + error);
                res.statusCode = 404;
                replyObject.statusCode = 404;
                replyObject.errorInformation = error;
                res.json(replyObject);
              }
              else
              {
                res.statusCode = 200;
                
                replyObject.statusCode = 200;
                replyObject.status = true;
                replyObject.results = results;
                console.log(replyObject);
                res.json(replyObject);
              }
        });
    }
}   
// middleware

// make the localhost listen to further instructions/input

