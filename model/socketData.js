/**
 * socketData.js
 * @description :: model of a database collection
 */

const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('../config/dbConnection');

const socketData = sequelize.define('socketData', {
  socketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  message: DataTypes.STRING,
});
sequelizePaginate.paginate(socketData);
module.exports = socketData;
