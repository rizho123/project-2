module.exports = function(sequelize, DataTypes) {
    var Deck = sequelize.define("Deck", {
        name: DataTypes.STRING,
        creator: DataTypes.STRING,
        mainboard: DataTypes.TEXT,
        sideboard: DataTypes.TEXT,
        url: DataTypes.STRING,
        format: DataTypes.STRING
    });
    return Deck;
};