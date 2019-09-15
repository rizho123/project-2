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

//Change to true if you need to download and import card data. NOTE: only do this once or you will have duplicate entries in your db
var dbImport = false;

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

function postAllCards(jsonArr, i) {
  if (i < jsonArr.length) {
    if (jsonArr[i].legalities.standard === "legal") {
      axios
        .post("http://localhost:3000/api/cards", jsonArr[i])
        .then(function(response) {
          console.log(response);
          postAllCards(jsonArr, i + 1);
        });
    } else {
      postAllCards(jsonArr, i + 1);
    }
  }
}



// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    if (dbImport) {
      axios
        .get("https://archive.scryfall.com/json/scryfall-oracle-cards.json")
        .then(function(response) {
          postAllCards(response.data, 0);
        });
    }
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
