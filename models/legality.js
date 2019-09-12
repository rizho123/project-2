module.exports = function(sequelize, DataTypes) {
  var Legality = sequelize.define("Legality", {
    name: DataTypes.STRING
  });

  Legality.associate = function(models) {
    Legality.belongsToMany(models.Card, { through: "CardLegality" });
  };

  return Legality;
};
