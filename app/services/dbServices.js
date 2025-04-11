const dbServices = {};

//find Data
dbServices.findOneData=async (model,filter) => {
    return model.findOne(filter);
}

dbServices.updateOneData=async (model,filter,query,options) => {
    return model.updateOne(filter, query, options);
}

module.exports = dbServices;