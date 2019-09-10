module.exports = function(sequelize, DataTypes) {
  var Color = sequelize.define("Color", {
    name: DataTypes.STRING,
    symbol: DataTypes.STRING
  });

  Color.associate = function(models) {
    Color.belongsToMany(models.Card, { through: "CardColor" });
  };

  return Color;
};
