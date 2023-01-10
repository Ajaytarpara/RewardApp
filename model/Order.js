/**
 * Order.js
 * @description :: sequelize model of database table Order
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Order = sequelize.define('Order',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  rewardId:{ type:DataTypes.INTEGER },
  userId:{ type:DataTypes.INTEGER },
  adId:{ type:DataTypes.STRING },
  uniqueAdId:{ type:DataTypes.STRING },
  isWinner:{ type:DataTypes.STRING },
  isResultDeclured:{ type:DataTypes.STRING },
  isDeleted:{ type:DataTypes.BOOLEAN },
  isActive:{ type:DataTypes.BOOLEAN },
  createdAt:{ type:DataTypes.DATE },
  updatedAt:{ type:DataTypes.DATE },
  addedBy:{ type:DataTypes.INTEGER },
  updatedBy:{ type:DataTypes.INTEGER }
}
,{
  hooks:{
    beforeCreate: [
      async function (Order,options){
        Order.isActive = true;
        Order.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Order,options){
        if (Order !== undefined && Order.length) { 
          for (let index = 0; index < Order.length; index++) { 
        
            const element = Order[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Order.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Order);
sequelizePaginate.paginate(Order);
module.exports = Order;
