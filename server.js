require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

function postAllCards(jsonArr, i) {
  axios.post("http://localhost:3000/api/cards", jsonArr[i]).then(function(response) {
    if (i < jsonArr.length) {
      postAllCards(jsonArr, i + 1);
    }
  })
}
// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
/*     axios.get("https://archive.scryfall.com/json/scryfall-oracle-cards.json").then(function(response) {
      postAllCards(response.data, 0);
    }); */
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
