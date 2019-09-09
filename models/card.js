module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define("Card", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artist: DataTypes.STRING,
    colors: DataTypes.STRING,
    convertedManaCost: DataTypes.FLOAT,
    flavorText: DataTypes.TEXT,
    layout: DataTypes.STRING,
    loyalty: DataTypes.INTEGER,
    manaCost: DataTypes.STRING,
    number: DataTypes.INTEGER,
    power: DataTypes.STRING,
    printings: DataTypes.STRING,
    rarity: DataTypes.STRING,
    scryfallIllustrationId: DataTypes.STRING,
    side: DataTypes.STRING,
    type: DataTypes.STRING,
    text: DataTypes.TEXT,
    toughness: DataTypes.STRING,
    types: DataTypes.STRING,
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  });

  Card.associate = function(models) {
    Card.belongsToMany(models.Deck, {through: "CardDeck"});
    Card.belongsToMany(models.Type, {through: "CardType"});
    Card.belongsToMany(models.Color, {through: "CardColor"});
    Card.belongsToMany(models.Format, {through: "CardFormat"});
  };

  return Card;
};
