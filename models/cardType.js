module.exports = function(sequelize, DataTypes) {
  var CardType = sequelize.define("CardType", {
    name: DataTypes.STRING
  });

  CardType.associate = function(models) {
    CardType.belongsToMany(models.Card, { through: "CardCardType" });
  };

  return CardType;
};
