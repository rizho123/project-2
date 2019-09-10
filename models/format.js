module.exports = function(sequelize, DataTypes) {
    var Format = sequelize.define("Format", {
        name: DataTypes.String
    });

    Format.associate = function(models) {
        Format.belongsToMany(models.Card, {through: "CardFormat"});
    };

    return Format;
};