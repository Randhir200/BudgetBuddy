const Config = require('../../models/configModel');
const mongoose = require('mongoose');
const { responseJson } = require('../../utils/responseJson');

const getAllConfigs = async (req, res)=>{
      const {userId} = req.query;
      try{
        // Check if userId is valid and non-empty before querying
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.info(`INFO: Invalid or missing userId!\n`);
            return responseJson(res, "badRequest", "Invalid or missing userId");
        }

        // Query the database with a valid userId
        const ConfigRaw = await Config.find({ userId });

        // If no expense data is found, handle accordingly
        if (!ConfigRaw || ConfigRaw.length === 0) {
            console.info(`INFO: No configs found for the given userId!\n`);
            return responseJson(res, "notFound", "No configs found for the given userId");
        }

      // Return success response with the expense data
    console.info(`INFO: Configs retrieved successfully!\n`);
    return responseJson(res, "success", "Config retrieved successfully", ConfigRaw);
    }catch(err){
        console.error(`ERROR: Somthing went wrong! ${err} \n`);
        return responseJson(res, "internalError", `Somthing went wrong! ${err}`);
    }
}

module.exports = getAllConfigs