const { default: mongoose } = require("mongoose");

const dbServices = {};

//find all data
dbServices.findData = (model,filter) => {
    return model.find(filter);
}

//find Data
dbServices.findOneData=async (model,filter) => {
    return model.findOne(filter);
}

//update one data
dbServices.updateOneData=async (model,filter,query,options) => {
    return model.updateOne(filter, query, options);
}


dbServices.lookupDataWithPagination = (model, from, localField, foreignField, as, userId, skip, limit) => {
    console.log(skip,limit);
    return model.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: from,                       // "resumes"  -->MongoDB collection name
                localField: localField,           // "_id"      -->in user
                foreignField: foreignField,       // "userId"   -->this fiel
                as: as                            // "resumes"  -->as aoutput
            }
        },
        {
            $addFields: {
                [as]: { $slice: [`$${as}`, skip, limit] }
            }
        },
        {
            $project: {
                password: 0
            }
        }
    ]);
};


module.exports = dbServices;