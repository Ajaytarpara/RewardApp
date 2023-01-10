/**
 * RewardController.js
 * @description :: exports action methods for Reward.
 */

const Reward = require('../../../model/Reward');
const RewardSchemaKey = require('../../../utils/validation/RewardValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');
const deleteDependentService = require('../../../utils/deleteDependent');
const utils = require('../../../utils/common');

module.exports = {};
