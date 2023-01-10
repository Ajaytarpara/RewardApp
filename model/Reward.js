/**
 * Reward.js
 * @description :: sequelize model of database table Reward
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Reward = sequelize.define('Reward',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique:true
  },
  name:{ type:DataTypes.STRING },
  prize:{ type:DataTypes.BIGINT },
  limit:{ type:DataTypes.BIGINT },
  adUrl:{ type:DataTypes.STRING },
  bannerUrl:{ type:DataTypes.STRING },
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
      async function (Reward,options){
        Reward.isActive = true;
        Reward.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Reward,options){
        if (Reward !== undefined && Reward.length) { 
          for (let index = 0; index < Reward.length; index++) { 
        
            const element = Reward[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Reward.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Reward);
sequelizePaginate.paginate(Reward);
module.exports = Reward;
