'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    tableName:'User'    
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};