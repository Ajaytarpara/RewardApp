/**
 * RewardRoutes.js
 * @description :: CRUD API routes for Reward
 */

const express = require('express');
const router = express.Router();
const RewardController = require('../../controller/admin/RewardController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/reward/create').post(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.addReward);
router.route('/admin/reward/list').post(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.findAllReward);
router.route('/admin/reward/count').post(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.getRewardCount);
router.route('/admin/reward/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.getReward);
router.route('/admin/reward/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.updateReward);    
router.route('/admin/reward/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.partialUpdateReward);
router.route('/admin/reward/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.softDeleteReward);
router.route('/admin/reward/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,RewardController.softDeleteManyReward);

module.exports = router;
