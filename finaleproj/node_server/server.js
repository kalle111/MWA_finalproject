var express = require('express');
var app=express();
const path = require('path');

//controlls app:
//var appController = require('./appController');
//all REST-Controllers (customerController == consumerController, orderController, offerController, workitemController)
var customerController = require('./customerController');
var orderController = require('./orderController');
var offerController = require('./offerController');
var workitemController = require('./workitemController');
var authenticationController = require('./authenticationController');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var expressValidator = require('express-validator');


//server-settings
const hostname = '127.0.0.1';
const port = process.env.PORT || 3032;
const startTime = (Date.now()/1000); 
/* unnecessary handlebar
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
*/

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
app.use(expressValidator());
app.use(cookieParser());

//logging middleware
app.use(log);
function log(req,res,next) {
  console.log(new Date(), "Method: " + req.method + ", URL: "+req.url + ", FROM: " + req.connection.remoteAddress);
  next();
}

// REST api

app.route('/customers/data')
  .get(customerController.fetchAllCustomers)
  
app.route('/customers/filter/')
  .get(customerController.fetchCustomer);


// customer-level registration
app.route('/signup/new/')
  .post(authenticationController.registerCustomer);
app.route('/login/')
  .post(authenticationController.loginAuthentication);


// admin queries
app.route('/orders/all/')
  .get(orderController.fetchOrdersForAllCustomers)
  .post(orderController.fetchOrdersForAllCustomersFiltered);

//customer deletion.
app.route('/customer/deletionbyid')
  .delete(customerController.deleteCustomer)
app.route('/customer/offers/deleteall')
  .delete(offerController.deleteOffers)
app.route('/customer/orders/deleteall')
  .delete(orderController.deleteOrders)


app.route('/')
app.route('/offers/all/')
  .get(offerController.fetchOffersForAllCustomers)
  .post(offerController.fetchOffersForAllCustomersFiltered);

app.route('/offers/answer/')
  .put(offerController.updateOfferInformationAnswer)
// order status prefetch
app.route('/orders/status/')
  .get(orderController.statusPreFetch);

app.route('/offers/status/')
  .get(offerController.statusPreFetch);

app.route('/customer/orders/')
  .post(customerController.fetchOrdersForCustomer)
  .put(customerController.updateOrderInformation);

app.route('/customer/orders/new')
  .post(orderController.addNewOrder);

app.route('/orders/start/')
  .put(orderController.startOrder)

app.route('/orders/finish/')
  .put(orderController.finishOrder)

app.route('/customer/offers/')
  .post(customerController.fetchOffersForCustomer)
  .put(customerController.updateOfferInformation);

app.route('/customer/offers/new')
  .post(offerController.addNewOffer)

app.route('/customer/offers/delete')
  .delete(offerController.deleteOffer)


app.route('/customer/offers/accrej')
  .post(offerController.acceptRejectStatusUpdate);

app.route('/workitems/')
  .get(workitemController.fetchAllWorkItems);

app.route('/profile/')
  .post(customerController.fetchCustomerProfileData)
  .put(customerController.updateCustomerProfile);

app.route('/customer/orders/delete')
  .delete(orderController.deleteOrder)

app.route('/customer/orders/accrej')
  .post(orderController.acceptRejectStatusUpdate);

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
