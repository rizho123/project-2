//columns all subject to change depending on what we end up needing
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define("Card", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artist: DataTypes.STRING,
    colorString: DataTypes.STRING,
    convertedManaCost: DataTypes.FLOAT,
    flavorText: DataTypes.TEXT,
    loyalty: DataTypes.STRING,
    manaCost: DataTypes.STRING,
    power: DataTypes.STRING,
    rarity: DataTypes.STRING,
    text: DataTypes.TEXT,
    toughness: DataTypes.STRING,
    typeString: DataTypes.STRING,
    oracleId: DataTypes.STRING,
    setName: DataTypes.STRING,
    imageURLNormal: DataTypes.STRING,
    imageURLSmall: DataTypes.STRING,
    imageURLArtCrop: DataTypes.STRING
  });

  Card.associate = function(models) {
    Card.belongsToMany(models.Deck, { through: "CardDeck" });
    Card.belongsToMany(models.CardType, { through: "CardCardType" });
    Card.belongsToMany(models.Color, { through: "CardColor" });
  };

  return Card;
};
