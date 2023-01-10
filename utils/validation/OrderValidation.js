/**
 * OrderValidation.js
 * @description :: validate each post and put request as per Order model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Order */
exports.schemaKeys = joi.object({
  rewardId: joi.number().integer().allow(0),
  userId: joi.number().integer().allow(0),
  adId: joi.string().allow(null).allow(''),
  uniqueAdId: joi.string().allow(null).allow(''),
  isWinner: joi.string().allow(null).allow(''),
  isResultDeclured: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of Order for updation */
exports.updateSchemaKeys = joi.object({
  rewardId: joi.number().integer().allow(0),
  userId: joi.number().integer().allow(0),
  adId: joi.string().allow(null).allow(''),
  uniqueAdId: joi.string().allow(null).allow(''),
  isWinner: joi.string().allow(null).allow(''),
  isResultDeclured: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Order for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      rewardId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      userId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      adId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      uniqueAdId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isWinner: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isResultDeclured: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
