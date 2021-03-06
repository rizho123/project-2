//columns all subject to change depending on what we end up needing
module.exports = function(sequelize, DataTypes) {
  var Deck = sequelize.define("Deck", {
    name: DataTypes.STRING,
    creator: DataTypes.STRING,
    mainboard: DataTypes.TEXT,
    sideboard: DataTypes.TEXT,
    url: DataTypes.STRING,
    format: DataTypes.STRING
  });

  Deck.associate = function(models) {
    Deck.belongsTo(models.User);
    Deck.belongsToMany(models.Card, { through: "CardDeck" });
  };

  return Deck;
};
