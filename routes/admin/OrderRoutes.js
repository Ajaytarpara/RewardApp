/**
 * OrderRoutes.js
 * @description :: CRUD API routes for Order
 */

const express = require('express');
const router = express.Router();
const OrderController = require('../../controller/admin/OrderController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/order/create').post(auth(PLATFORM.ADMIN),checkRolePermission,OrderController.addOrder);
router.route('/admin/order/list').post(auth(PLATFORM.ADMIN),checkRolePermission,OrderController.findAllOrder);
router.route('/admin/order/count').post(auth(PLATFORM.ADMIN),checkRolePermission,OrderController.getOrderCount);
router.route('/admin/order/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,OrderController.getOrder);
router.route('/admin/order/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,OrderController.updateOrder);    
router.route('/admin/order/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,OrderController.partialUpdateOrder);

module.exports = router;
