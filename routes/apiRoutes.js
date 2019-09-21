var db = require("../models");

module.exports = function(app) {
  app.get("/api/cards", function(req, res) {
    var Op = db.Sequelize.Op;
    var searchParams = req.body;
    var queryObj = {
      where: {},
      include: []
    };

    if (searchParams.hasOwnProperty("colors")) {
      var includeObj = {
        model: db.Color,
        where: {
          name: {
            /* eslint-disable */
            [Op.in]: searchParams.colors // eslint-disable-line
            /* eslint-enable */
          }
        }
      };

      queryObj.include.push(includeObj);
    } 
    else {
      queryObj.include.push(db.Color);
    }
    queryObj.include.push(db.CardType);

    if(searchParams.text) {
      var textArray = searchParams.text.split(" ");
      var objArray = [];
      for (var i = 0; i < textArray.length; i++) {
        var text = textArray[i];
        /* eslint-disable */
        objArray.push({name: {[Op.like]: `%${text}%`}});  // eslint-disable-line
        objArray.push({text: {[Op.like]: `%${text}%`}});  // eslint-disable-line
        /* eslint-enable */
      }

      queryObj.where = {
        /* eslint-disable */
        [Op.or]: objArray  // eslint-disable-line
        /* eslint-enable */
      };
      
    }


    db.Card.findAll(queryObj).then(function(cards) {
      res.json(cards);
    });
  });

  app.get("/api/decks", function(req, res) {
    db.Deck.findAll({include: [db.Card]}).then(function(decks) {
      res.json(decks);
    });
  });

  // Create a new deck
  app.post("/api/decks", function(req, res) {
    var cardList = req.body["deck[]"];

    db.Deck.create({mainboard: cardList.toString()}).then(function(dbDeck) {
      dbDeck.setCards(cardList).then(function() {
        dbDeck.save().then(function(deck) {
          res.json(deck);
        });
      });
    });
  });

  // Delete a deck by id
  app.delete("/api/decks/:id", function(req, res) {
    db.Deck.destroy({ where: { id: req.params.id } }).then(function(dbDeck) {
      res.json(dbDeck);
    });
  });

  // function addTypes(card, types, i) {
  //   return db.CardType.findOrCreate({ where: { name: types[i] } }).then(
  //     function(cardtype) {
  //       card.addCardType(cardtype[0]);
  //       if (i === types.length - 1) {
  //         return card.save();
  //       } else {
  //         return addTypes(card, types, i + 1);
  //       }
  //     }
  //   );
  // }
  // function addColors(card, colors, i) {
  //   return db.Color.findOrCreate({ where: { name: colors[i] } }).then(function(
  //     dbColor
  //   ) {
  //     card.addColor(dbColor[0]);
  //     if (i === colors.length - 1) {
  //       return card.save();
  //     } else {
  //       return addColors(card, colors, i + 1);
  //     }
  //   });
  // }

  // app.post("/api/cards", function(req, res) {
  //   var card = req.body;
  //   var queryObj = {};

  //   if (card.hasOwnProperty("name")) {
  //     if (card.name) {
  //       queryObj.name = card.name;
  //     } else {
  //       queryObj.name = "";
  //     }
  //   } else {
  //     queryObj.name = "";
  //   }

  //   if (card.hasOwnProperty("cmc")) {
  //     queryObj.convertedManaCost = card.cmc;
  //   }
  //   if (card.hasOwnProperty("rarity")) {
  //     queryObj.rarity = card.rarity;
  //   }
  //   if (card.hasOwnProperty("type_line")) {
  //     queryObj.typeString = card.type_line;
  //   }
  //   if (card.hasOwnProperty("set_name")) {
  //     queryObj.setName = card.set_name;
  //   }
  //   if (card.hasOwnProperty("oracle_id")) {
  //     queryObj.oracleId = card.oracle_id;
  //   }
  //   if (card.hasOwnProperty("loyalty")) {
  //     queryObj.loyalty = card.loyalty;
  //   }
  //   if (card.hasOwnProperty("color_identity")) {
  //     queryObj.colorString = card.color_identity.toString();
  //   }
  //   if (card.hasOwnProperty("flavor_text")) {
  //     queryObj.flavorText = card.flavor_text;
  //   }
  //   if (card.hasOwnProperty("artist")) {
  //     queryObj.artist = card.artist;
  //   }
  //   if (card.hasOwnProperty("mana_cost")) {
  //     queryObj.manaCost = card.mana_cost;
  //   }
  //   if (card.hasOwnProperty("power")) {
  //     queryObj.power = card.power;
  //   }
  //   if (card.hasOwnProperty("oracle_text")) {
  //     queryObj.text = card.oracle_text;
  //   }
  //   if (card.hasOwnProperty("toughness")) {
  //     queryObj.toughness = card.toughness;
  //   }
  //   if (card.hasOwnProperty("image_uris")) {
  //     queryObj.imageURLNormal = card.image_uris.normal;
  //     queryObj.imageURLSmall = card.image_uris.small;
  //     queryObj.imageURLArtCrop = card.image_uris.art_crop;
  //   }
  //   if (card.hasOwnProperty("power")) {
  //     queryObj.power = card.power;
  //   }
  //   if (card.hasOwnProperty("power")) {
  //     queryObj.power = card.power;
  //   }
  //   if (card.hasOwnProperty("power")) {
  //     queryObj.power = card.power;
  //   }


  //   db.Card.create(queryObj).then(function(dbCard) {
  //     if (!dbCard.typeString && !dbCard.colorString) {
  //       res.json(dbCard);
  //     } else if (dbCard.typeString) {
  //       var types = dbCard.typeString
  //         .split("—")
  //         .join("")
  //         .split(" ");
  //       var index = types.length;
  //       while (index--) {
  //         if (!types[index]) {
  //           types.splice(index, 1);
  //         }
  //       }

  //       addTypes(dbCard, types, 0).then(function(cardInstance) {
  //         if (cardInstance.colorString) {
  //           var colors = cardInstance.colorString.split(",");

  //           addColors(cardInstance, colors, 0).then(function(
  //             cardInstanceFinal
  //           ) {
  //             res.json(cardInstanceFinal);
  //           });
  //         } else {
  //           res.json(cardInstance);
  //         }
  //       });
  //     } else {
  //       var colors = dbCard.colorString.split(",");
  //       addColors(dbCard, colors, 0).then(function(cardInstance) {
  //         res.json(cardInstance);
  //       });
  //     }
  //   });
  // });
};
