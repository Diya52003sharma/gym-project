const dietPlanModel = require("./dietPlanModel");

const add = (req, res) => {
    var errMsg = [];
    if (!req.body.customerId) errMsg.push("customerId is required");
    if (!req.body.trainerId) errMsg.push("trainerId is required");
    if (!req.body.dietPlanName) errMsg.push("dietPlanName is required");
    if (!req.body.duration) errMsg.push("duration is required");
    if (!req.body.restrictions) errMsg.push("restrictions is required");
    if (!req.body.description) errMsg.push("description is required");
    if (errMsg.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: errMsg
        });
    }

    const newDietPlan = new dietPlanModel();
    newDietPlan.customerId = req.body.customerId;
    newDietPlan.trainerId = req.body.trainerId;
    newDietPlan.dietPlanName = req.body.dietPlanName;
    newDietPlan.restrictions = req.body.restrictions;
    newDietPlan.description = req.body.description;
    newDietPlan.duration = req.body.duration;
    newDietPlan.isPublic = req.body.isPublic;

    newDietPlan.save()
        .then(planData => {
            res.json({
                status: 200,
                success: true,
                message: "Diet plan added successfully",
                data: planData
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to save diet plan",
                errmsg: err.message
            });
        });
};

const getall = (req, res) => {
    dietPlanModel.find()
        .populate("customerId")
        .populate("trainerId")
        .then(plans => {
            res.json({
                status: 200,
                success: true,
                message: "Diet plans loaded successfully",
                data: plans
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err.message
            });
        });
};

const getSingle = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 400,
            success: false,
            message: "_id is required"
        });
    }

    dietPlanModel.findOne({ _id: req.body._id })
        .populate("customerId")
        .populate("trainerId")
        .then(plan => {
            if (!plan) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Diet plan not found"
                });
            }

            res.json({
                status: 200,
                success: true,
                message: "Diet plan fetched successfully",
                data: plan
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err.message
            });
        });
};

const update = (req, res) => {
    var errMsgs = [];
    if (!req.body._id) errMsgs.push("_id is required!!");

    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    } else {
        dietPlanModel.findOne({ _id: req.body._id })
            .then(plan => {
                if (!plan) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Diet plan not found"
                    });
                } else {
                    if (req.body.customerId) plan.customerId = req.body.customerId;
                    if (req.body.trainerId) plan.trainerId = req.body.trainerId;
                    if (req.body.dietPlanName) plan.dietPlanName = req.body.dietPlanName;
                    if (req.body.restrictions) plan.restrictions = req.body.restrictions;
                    if (req.body.description) plan.description = req.body.description;
                    if (req.body.duration) plan.duration = req.body.duration;
                    if (req.body.isPublic !== undefined) plan.isPublic = req.body.isPublic;
                    
                    plan.save()
                        .then(updatedPlan => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Diet plan updated successfully",
                                data: updatedPlan
                            });
                        })
                        .catch(err => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Internal server error",
                                errmessages: err
                            });
                        });
                }
            })
            .catch(err => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmessages: err
                });
            });
    }
};



const getPagination = (req, res) => {
    var errMsgs = [];
    if (!req.body.pageno) errMsgs.push("pageno is required");
    if (!req.body.limit) errMsgs.push("limit is required");

    if (errMsgs.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    const limit = parseInt(req.body.limit);
    const pageno = parseInt(req.body.pageno);
    const skip = pageno > 1 ? (pageno - 1) * limit : 0;

    dietPlanModel.find()
        .populate("customerId")
        .populate("trainerId")
        .skip(skip)
        .limit(limit)
        .then(plans => {
            dietPlanModel.countDocuments()
                .then(count => {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Data loaded",
                        totaldocuments: count,
                        data: plans
                    });
                })
                .catch(err => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Error counting documents",
                        errmsg: err.message
                    });
                });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err.message
            });
        });
};

const deleteOne = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "_id is required"
        });
    }

    dietPlanModel.deleteOne({ _id: req.body._id })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Diet plan not found"
                });
            }

            res.json({
                status: 200,
                success: true,
                message: "Diet plan deleted successfully"
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to delete diet plan",
                errmsg: err.message
            });
        });
};

const changestatus = (req, res) => {
    if (!req.body._id || req.body.status === undefined) {
        res.send({
            status: 422,
            success: false,
            message: "_id and status are required!!"
        });
    }
    else {
        dietPlanModel.findOne({ _id: req.body._id })
            .then((dietPlanData) => {
                if (!dietPlanData) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "diet plan not found!!",
                    });
                }
                else {
                    dietPlanData.isPublic = req.body.status;
                    dietPlanData.save()
                        .then(() => {
                            var statusMessage = req.body.status ? "public" : "private";
                            res.send({
                                status: 200,
                                success: true,
                                message: "diet plan " + statusMessage + " successfully",
                                data: dietPlanData
                            });
                        })
                        .catch((err) => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Failed to update status",
                                errmessages: err
                            });
                        });
                }
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmessages: err
                });
            });
    }
};

module.exports = { add, getall, getSingle, update, getPagination, deleteOne, changestatus };
