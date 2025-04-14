const dbServices = {};

//find all data
dbServices.findData = async(model,filter) => {
    return model.find(filter).lean();
}

//find Data
dbServices.findOneData=async (model,filter) => {
    return model.findOne(filter);
}

//update one data
dbServices.updateOneData=async (model,filter,query,options) => {
    return model.updateOne(filter, query, options);
}

module.exports = dbServices;