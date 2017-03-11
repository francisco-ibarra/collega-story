/**
 * Storygram simple backend server
 * @author Marcos Baez <baez@disi.unitn.it>
 */

var express = require('express');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// set as static folder "public" on the root
app.use(express.static('public'));

// Initialising the APIs
var apis = require("./apis");
apis.init(app);

// starting the server
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Storygram server listening at http://localhost:' + port);

