'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Webuser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Webuser.init({
    fullName: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    location: DataTypes.STRING,
    company: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Webuser',
  });
  return Webuser;
};