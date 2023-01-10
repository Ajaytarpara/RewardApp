/**
 * RewardController.js
 * @description :: exports action methods for Reward.
 */

const Reward = require('../../model/Reward');
const RewardSchemaKey = require('../../utils/validation/RewardValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');

/**
 * @description : create record of Reward in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Reward. {status, message, data}
 */ 
const addReward = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      RewardSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    dataToCreate.addedBy = req.user.id;
    delete dataToCreate['updatedBy'];
        
    let createdReward = await dbService.createOne(Reward,dataToCreate);
    return  res.success({ data :createdReward });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Reward from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Reward(s). {status, message, data}
 */
const findAllReward = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundReward;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      RewardSchemaKey.findFilterKeys,
      Reward.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    if (dataToFind && dataToFind.isCountOnly){
      foundReward = await dbService.count(Reward, query);
      if (!foundReward) {
        return res.recordNotFound();
      } 
      foundReward = { totalRecords: foundReward };
      return res.success({ data :foundReward });
    }
    if (dataToFind && dataToFind.options !== undefined) {
      options = dataToFind.options;
    }
    foundReward = await dbService.paginate( Reward,query,options);
    if (!foundReward){
      return res.recordNotFound();
    }
    return res.success({ data:foundReward }); 
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Reward from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Reward. {status, message, data}
 */
const getReward = async (req, res) => {
  try { 
    let id = req.params.id;
    let foundReward = await dbService.findOne(Reward,{ id :id });
    if (!foundReward){
      return res.recordNotFound();
    }
    return  res.success({ data :foundReward });

  } catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : returns total number of records of Reward.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getRewardCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      RewardSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }  
    let countedReward = await dbService.count(Reward,where);
    if (!countedReward){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :countedReward } });

  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update record of Reward with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Reward.
 * @return {Object} : updated Reward. {status, message, data}
 */
const updateReward = async (req, res) => {
  try {
    let dataToUpdate = { ...req.body || {} };
    let query = {};
    delete dataToUpdate.addedBy;
    if (!req.params || !req.params.id) {
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }          
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      RewardSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    query = { id:req.params.id };
    let updatedReward = await dbService.update(Reward,query,dataToUpdate);
    return  res.success({ data :updatedReward }); 
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }    
};

/**
 * @description : partially update record of Reward with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Reward.
 * @return {Object} : updated Reward. {status, message, data}
 */
const partialUpdateReward = async (req, res) => {
  try {
    let dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      RewardSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { id:req.params.id };
    let updatedReward = await dbService.update(Reward, query, dataToUpdate);
    if (!updatedReward) {
      return res.recordNotFound();
    }
    return res.success({ data : updatedReward });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate record of Reward from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Reward.
 * @return {Object} : deactivated Reward. {status, message, data}
 */
const softDeleteReward = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    let updatedReward = await deleteDependentService.softDeleteReward(query, updateBody);
    if (!updatedReward){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedReward });

  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate multiple records of Reward from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Reward.
 * @return {Object} : number of deactivated documents of Reward. {status, message, data}
 */
const softDeleteManyReward = async (req, res) => {
  try {
    let dataToUpdate = req.body;
    let query = {};
    if (!req.params || !req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }            
    query = { id:{ $in:dataToUpdate.ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    let updatedReward = await deleteDependentService.softDeleteReward(query, updateBody);
    if (!updatedReward) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedReward });

  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

module.exports = {
  addReward,
  findAllReward,
  getReward,
  getRewardCount,
  updateReward,
  partialUpdateReward,
  softDeleteReward,
  softDeleteManyReward,
};
