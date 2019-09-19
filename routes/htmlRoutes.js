var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Card.findAll({}).then(function(dbCards) {
      res.render("index", {
        card_data: dbCards
      });
    });
  });

  app.get("/decks/:id", function(req, res) {
    db.Card.findAll({}).then(function(dbCards) {
      db.Deck.findOne({where: {id: req.params.id}, include: [db.Card]}).then(function(dbDeck) {
        res.render("index", {
          card_data: dbCards,
          deck: dbDeck
        });
      });
    });
  });

  // Load example page and pass in an example by id
  // app.get("/example/:id", function(req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function(
  //     dbExample
  //   ) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
