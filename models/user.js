module.exports = function(sequelize,DataTypes) {
    var User = sequelize.define("User", {
        //Not sure how we'll be storing user accounts yet. Will add once we have an authentication solution
    });
    return User;
};