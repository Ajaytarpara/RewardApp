/**
 * authController.js
 * @description :: exports authentication methods
 */
const authService =  require('../../../services/auth');
const {
  user,role,userRole,userAuthSettings,userTokens,pushNotification
} = require('../../../model/index');
const dbService = require('../../../utils/dbService');
const dayjs = require('dayjs');
const userSchemaKey = require('../../../utils/validation/userValidation');
const validation = require('../../../utils/validateRequest');
const authConstant = require('../../../constants/authConstant');
const { checkUniqueFieldsInDatabase } = require('../../../utils/common');
const {
  sendPasswordBySMS, sendPasswordByEmail 
} = require('../../../services/auth');
    
/**
 * @description : user registration 
 * @param {Object} req : request for register
 * @param {Object} res : response for register
 * @return {Object} : response for register {status, message, data}
 */
const register = async (req, res) => {
  try {
    let dataToRegister = req.body;
    let validateRequest = validation.validateParamsWithJoi(
      dataToRegister,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    let isEmptyPassword = false;
    if (!dataToRegister.password){
      isEmptyPassword = true;
      dataToRegister.password = Math.random().toString(36).slice(2);
    } 

    let checkUniqueFields = await checkUniqueFieldsInDatabase(user,[ 'phoneNumber' ],dataToRegister,'INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Unique ${checkUniqueFields.field} are allowed.` });
    }

    const result = await dbService.createOne(user,{
      ...dataToRegister,
      userType: authConstant.USER_TYPES.User
    });
    if (isEmptyPassword && req.body.email){
      await sendPasswordByEmail({
        email: req.body.email,
        password: req.body.password
      });
    }
    if (isEmptyPassword && req.body.mobileNo){
      await sendPasswordBySMS({
        mobileNo: req.body.mobileNo,
        password: req.body.password
      });
    }
    return  res.success({ data :result });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }  
};

/**
 * @description : send OTP to user for login
 * @param {Object} req : request for sendOtpForLogin
 * @param {Object} res : response for sendOtpForLogin
 * @return {Object} : response for sendOtpForLogin {status, message, data}
 */
const sendOtpForLogin = async (req,res)=>{
  try {
    let params = req.body;
    if (!params.username){
      return res.badRequest({ message : 'Insufficient request parameters! username is required.' });
    }
    let result = await authService.sendLoginOTP(params.username);
    if (result.flag){
      return res.failure({ message :result.data });
    }
    return res.success({ message :result.data });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : login with username and OTP
 * @param {Object} req : request for loginWithOTP
 * @param {Object} res : response for loginWithOTP
 * @return {Object} : response for loginWithOTP {status, message, data}
 */
const loginWithOTP = async (req, res) => {
  const params = req.body;
  try {
    if (!params.code || !params.username) {
      return res.badRequest({ message : 'Insufficient request parameters! username and code is required.' });
    }
    let isCodeVerified = false;
    let where = { 'phoneNumber':params.username };
    where.isActive = true;where.isDeleted = false;        let User = await dbService.findOne(user,where);
    if (!User) {
      // invalid code
      return res.badRequest({ message :'Invalid Code' });
    } 
    let userAuth = await dbService.findOne(userAuthSettings,{ userId:User.id });
    if (userAuth && userAuth.loginOTP && userAuth.expiredTimeOfLoginOTP){
      isCodeVerified = userAuth.loginOTP == params.code ? true : false;
      if (dayjs(new Date()).isAfter(dayjs(userAuth.expiredTimeOfLoginOTP))) {// link expire
        return res.badRequest({ message :'Your reset password link is expired' });
      }
      if (userAuth.loginOTP !== params.code){
        return res.badRequest({ message :'Invalid Code' });
      }
    }
    let roleAccess = false;
    if (req.body.includeRoleAccess){
      roleAccess = req.body.includeRoleAccess;
    }
    let result = await authService.loginWithOTP(params.username, null, authConstant.PLATFORM.DEVICE,roleAccess);
    if (result.flag){
      return res.badRequest({ message :result.data });
    }
    return res.success({
      data:result.data,
      message :'Login successful.'
    });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : logout user
 * @param {Object} req : request for logout
 * @param {Object} res : response for logout
 * @return {Object} : response for logout {status, message, data}
 */
const logout = async (req, res) => {
  try {
    let userToken = await dbService.findOne(userTokens, {
      token: (req.headers.authorization).replace('Bearer ', ''),
      userId:req.user.id 
    });
    userToken.isTokenExpired = true;
    let id = userToken.id;
    delete userToken.id;
    await dbService.update(userTokens,{ id:id }, userToken.toJSON());
    let found = await dbService.findOne(pushNotification,{ userId:req.user.id });
    if (found){
      await dbService.update(pushNotification,{ id :found.id },{ isActive:false });
    }
    return res.success({ message :'Logged Out Successfully' });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : adding PlayerIDs to send push notification
 * @param {Object} req : request for addPlayerId
 * @param {Object} res : response for addPlayerId
 * @return {Object} : response for addPlayerId {status, message, data}
 */
const addPlayerId = async (req, res) => {
  try {
    let params = req.body;
    if (!params.userId || !params.playerId){
      return res.badRequest({ message : 'Insufficient request parameters! userId and playerId is required.' });
    }
    let found = await dbService.findOne(pushNotification,{ userId:params.userId });
    if (found){
      await dbService.update(pushNotification,{ id : found.id },{ playerId:params.playerId });
    } else {
      await dbService.createOne(pushNotification,params);
    }
    return res.success();

  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : removing PlayerIDs to send push notification
 * @param {Object} req : request for removePlayerId
 * @param {Object} res : response for removePlayerId
 * @return {Object} : response for removePlayerId {status, message, data}
 */
const removePlayerId = async (req, res) => {
  try {
    let params = req.body;
    if (!params && !params.deviceId){
      return res.badRequest({ message : 'Insufficient request parameters! deviceId is required.' });
    }
    let found = await dbService.findOne(pushNotification,{ deviceId:params.deviceId });
    if (found){
      await dbService.destroy(pushNotification,{ id :found.id });
    }
    return res.success();

  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
module.exports = {
  register,
  sendOtpForLogin,
  loginWithOTP,
  logout,
  addPlayerId,
  removePlayerId
};
