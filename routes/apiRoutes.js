var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new deck
  app.post("/api/decks", function(req, res) {
    db.Deck.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete a deck by id
  app.delete("/api/decks/:id", function(req, res) {
    db.Deck.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/api/cards", function(req, res) {
    var card = req.body;
    var colors = [];

    var queryObj = {};

    if (card.hasOwnProperty("name")) {
      if (card.name) {
        queryObj.name = card.name;
      } else {
        queryObj.name = "";
      }
    } else {
      queryObj.name = "";
    }

    if (card.hasOwnProperty("cmc")) {
      queryObj.convertedManaCost = card.cmc;
    }
    if (card.hasOwnProperty("rarity")) {
      queryObj.rarity = card.rarity;
    }
    if (card.hasOwnProperty("type_line")) {
      queryObj.typeString = card.type_line;
    }
    if (card.hasOwnProperty("set_name")) {
      queryObj.setName = card.set_name;
    }
    if (card.hasOwnProperty("oracle_id")) {
      queryObj.oracleId = card.oracle_id;
    }
    if (card.hasOwnProperty("loyalty")) {
      queryObj.loyalty = card.loyalty;
    }
    if (card.hasOwnProperty("color_identity")) {
      queryObj.colorString = card.color_identity.toString();
      for (var i = 0; i < card.color_identity.length; i++) {
        colors.push({ name: card.color_identity[i] });
      }
      queryObj.Colors = colors;
    }
    if (card.hasOwnProperty("flavor_text")) {
      queryObj.flavorText = card.flavor_text;
    }
    if (card.hasOwnProperty("artist")) {
      queryObj.artist = card.artist;
    }
    if (card.hasOwnProperty("mana_cost")) {
      queryObj.manaCost = card.mana_cost;
    }
    if (card.hasOwnProperty("power")) {
      queryObj.power = card.power;
    }
    if (card.hasOwnProperty("oracle_text")) {
      queryObj.text = card.oracle_text;
    }
    if (card.hasOwnProperty("toughness")) {
      queryObj.toughness = card.toughness;
    }
    if (card.hasOwnProperty("image_uris")) {
      queryObj.imageURLNormal = card.image_uris.normal;
      queryObj.imageURLSmall = card.image_uris.small;
      queryObj.imageURLArtCrop = card.image_uris.art_crop;
    }
    if (card.hasOwnProperty("power")) {
      queryObj.power = card.power;
    }
    if (card.hasOwnProperty("power")) {
      queryObj.power = card.power;
    }
    if (card.hasOwnProperty("power")) {
      queryObj.power = card.power;
    }
    if (card.hasOwnProperty("type_line")) {
      var types = [];
      var typeLine = card.type_line
        .split(" ")
        .join("")
        .split("—");
      for (var i = 0; i < typeLine.length; i++) {
        types.push({ name: typeLine[i] });
      }
      queryObj.CardTypes = types;
    }

    db.Card.create(queryObj, {
      include: [db.Color, db.CardType]
    }).then(function(card) {
      res.json(card);
    });
  });
};
