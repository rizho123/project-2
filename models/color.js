module.exports = function(sequelize, DataTypes) {
  var Color = sequelize.define("Color", {
    name: {
      type: DataTypes.STRING
    }
  });

  Color.associate = function(models) {
    Color.belongsToMany(models.Card, { through: "CardColor" });
  };

  return Color;
};
