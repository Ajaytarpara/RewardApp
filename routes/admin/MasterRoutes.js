/**
 * MasterRoutes.js
 * @description :: CRUD API routes for Master
 */

const express = require('express');
const router = express.Router();
const MasterController = require('../../controller/admin/MasterController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/master/create').post(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.addMaster);
router.route('/admin/master/list').post(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.findAllMaster);
router.route('/admin/master/count').post(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.getMasterCount);
router.route('/admin/master/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.getMaster);
router.route('/admin/master/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.updateMaster);    
router.route('/admin/master/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.partialUpdateMaster);
router.route('/admin/master/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.softDeleteMaster);
router.route('/admin/master/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,MasterController.softDeleteManyMaster);

module.exports = router;
