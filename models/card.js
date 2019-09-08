module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define("Card", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artist: DataTypes.STRING,
    borderColor: DataTypes.STRING,
    colors: DataTypes.STRING,
    convertedManaCost: DataTypes.FLOAT,
    flavorText: DataTypes.TEXT,
    layout: DataTypes.STRING,
    loyalty: DataTypes.INTEGER,
    manaCost: DataTypes.STRING,
    number: DataTypes.INTEGER,
    power: DataTypes.FLOAT,
    printings: DataTypes.STRING,
    rarity: DataTypes.STRING,
    scryfallIllustrationId: DataTypes.STRING,
    side: DataTypes.STRING,
    subtypes: DataTypes.STRING,
    supertypes: DataTypes.STRING,
    text: DataTypes.STRING,
    toughness: DataTypes.FLOAT,
    types: DataTypes.STRING,
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  });
  return Card;
};
