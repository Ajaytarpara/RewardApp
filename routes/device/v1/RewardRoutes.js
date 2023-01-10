/**
 * RewardRoutes.js
 * @description :: CRUD API routes for Reward
 */

const express = require('express');
const router = express.Router();
const RewardController = require('../../../controller/device/v1/RewardController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');

module.exports = router;
