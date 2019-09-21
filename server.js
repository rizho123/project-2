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

var syncOptions = { force: process.env.SyncOptions };

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
      addSingleCard(jsonArr[i], function() {
        postAllCards(jsonArr, i + 1);
      });
    } else {
      postAllCards(jsonArr, i + 1);
    }
  } else {
    console.log("Done importing cards!");
  }
}

function addSingleCard(jsonCard, cb) {
  var queryObj = {};

  if (jsonCard.hasOwnProperty("name")) {
    if (jsonCard.name) {
      queryObj.name = jsonCard.name;
    } else {
      queryObj.name = "";
    }
  } else {
    queryObj.name = "";
  }

  if (jsonCard.hasOwnProperty("cmc")) {
    queryObj.convertedManaCost = jsonCard.cmc;
  }
  if (jsonCard.hasOwnProperty("rarity")) {
    queryObj.rarity = jsonCard.rarity;
  }
  if (jsonCard.hasOwnProperty("type_line")) {
    queryObj.typeString = jsonCard.type_line;
  }
  if (jsonCard.hasOwnProperty("set_name")) {
    queryObj.setName = jsonCard.set_name;
  }
  if (jsonCard.hasOwnProperty("oracle_id")) {
    queryObj.oracleId = jsonCard.oracle_id;
  }
  if (jsonCard.hasOwnProperty("loyalty")) {
    queryObj.loyalty = jsonCard.loyalty;
  }
  if (jsonCard.hasOwnProperty("color_identity")) {
    queryObj.colorString = jsonCard.color_identity.toString();
  }
  if (jsonCard.hasOwnProperty("flavor_text")) {
    queryObj.flavorText = jsonCard.flavor_text;
  }
  if (jsonCard.hasOwnProperty("artist")) {
    queryObj.artist = jsonCard.artist;
  }
  if (jsonCard.hasOwnProperty("mana_cost")) {
    queryObj.manaCost = jsonCard.mana_cost;
  }
  if (jsonCard.hasOwnProperty("power")) {
    queryObj.power = jsonCard.power;
  }
  if (jsonCard.hasOwnProperty("oracle_text")) {
    queryObj.text = jsonCard.oracle_text;
  }
  if (jsonCard.hasOwnProperty("toughness")) {
    queryObj.toughness = jsonCard.toughness;
  }
  if (jsonCard.hasOwnProperty("image_uris")) {
    queryObj.imageURLNormal = jsonCard.image_uris.normal;
    queryObj.imageURLSmall = jsonCard.image_uris.small;
    queryObj.imageURLArtCrop = jsonCard.image_uris.art_crop;
  }
  if (jsonCard.hasOwnProperty("power")) {
    queryObj.power = jsonCard.power;
  }
  if (jsonCard.hasOwnProperty("power")) {
    queryObj.power = jsonCard.power;
  }
  if (jsonCard.hasOwnProperty("power")) {
    queryObj.power = jsonCard.power;
  }

  db.Card.create(queryObj).then(function(dbCard) {
    if (!dbCard.typeString && !dbCard.colorString) {
      cb();
    } else if (dbCard.typeString) {
      var types = dbCard.typeString
        .split("—")
        .join("")
        .split(" ");
      var index = types.length;
      while (index--) {
        if (!types[index]) {
          types.splice(index, 1);
        }
      }

      addTypes(dbCard, types, 0).then(function(cardInstance) {
        if (cardInstance.colorString) {
          var colors = cardInstance.colorString.split(",");

          addColors(cardInstance, colors, 0).then(function() {
            cb();
          });
        } else {
          cb();
        }
      });
    } else {
      var colors = dbCard.colorString.split(",");
      addColors(dbCard, colors, 0).then(function() {
        cb();
      });
    }
  });
}

function addTypes(card, types, i) {
  return db.CardType.findOrCreate({ where: { name: types[i] } }).then(function(
    cardtype
  ) {
    card.addCardType(cardtype[0]);
    if (i === types.length - 1) {
      return card.save();
    } else {
      return addTypes(card, types, i + 1);
    }
  });
}
function addColors(card, colors, i) {
  return db.Color.findOrCreate({ where: { name: colors[i] } }).then(function(
    dbColor
  ) {
    card.addColor(dbColor[0]);
    if (i === colors.length - 1) {
      return card.save();
    } else {
      return addColors(card, colors, i + 1);
    }
  });
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
