const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const app = express();
const expstatic = express.static(__dirname + "/public");
const methodOverride = require('method-override');
const bidUtils = require("./utils/bidUtils");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const session = require('express-session')
app.use(methodOverride('_method'))
var http = require('http').Server(app);
const io = require('socket.io')(http);
require("./utils/bidUtils").buildSocketFunctions(io,require("./data/bids"));


app.use("/public", expstatic);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))

app.use(fileUpload());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

http.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

bidUtils.startInterval();


