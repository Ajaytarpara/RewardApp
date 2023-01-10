/**
 * OrderRoutes.js
 * @description :: CRUD API routes for Order
 */

const express = require('express');
const router = express.Router();
const OrderController = require('../../../controller/device/v1/OrderController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/order/create').post(auth(PLATFORM.DEVICE),checkRolePermission,OrderController.addOrder);
router.route('/device/api/v1/order/list').post(auth(PLATFORM.DEVICE),checkRolePermission,OrderController.findAllOrder);
router.route('/device/api/v1/order/count').post(auth(PLATFORM.DEVICE),checkRolePermission,OrderController.getOrderCount);
router.route('/device/api/v1/order/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,OrderController.getOrder);
router.route('/device/api/v1/order/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,OrderController.updateOrder);    
router.route('/device/api/v1/order/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,OrderController.partialUpdateOrder);

module.exports = router;
