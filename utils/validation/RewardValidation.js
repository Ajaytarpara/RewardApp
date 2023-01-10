/**
 * RewardValidation.js
 * @description :: validate each post and put request as per Reward model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Reward */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  prize: joi.number().integer().allow(0),
  limit: joi.number().integer().allow(0),
  adUrl: joi.string().allow(null).allow(''),
  bannerUrl: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of Reward for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  prize: joi.number().integer().allow(0),
  limit: joi.number().integer().allow(0),
  adUrl: joi.string().allow(null).allow(''),
  bannerUrl: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Reward for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      prize: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      limit: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      adUrl: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      bannerUrl: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
