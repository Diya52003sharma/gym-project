const workoutPlanModel = require("./workoutPlanModel");

const add = (req, res) => {
    var errMsg = [];
    if (!req.body.trainerId) errMsg.push("trainerId is required");
    if (!req.body.workoutDescription) errMsg.push("workoutDescription is required");
    if (!req.body.duration) errMsg.push("duration is required");
    if (!req.body.exercises) errMsg.push("exercises is required");
    if (errMsg.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: errMsg
        });
    }

    const newWorkoutPlan = new workoutPlanModel();

        newWorkoutPlan.customerId= req.body.customerId;
        newWorkoutPlan.trainerId= req.body.trainerId;
        newWorkoutPlan.workoutDescription= req.body.workoutDescription;
        newWorkoutPlan.duration= req.body.duration;
        newWorkoutPlan.exercises= req.body.exercises.split(",").map(exercise => exercise.trim()); // Split exercises by comma and trim whitespace
        newWorkoutPlan.customerId = req.body.customerId,

    newWorkoutPlan.save()
        .then(planData => {
            res.json({
                status: 200,
                success: true,
                message: "Workout plan added successfully",
                data: planData
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to save workout plan",
                errmsg: err.message
            });
        });
};

const getall = (req, res) => {
    workoutPlanModel.find()
        .populate("customerId")
        .populate("trainerId")
        .then(plans => {
            res.json({
                status: 200,
                success: true,
                message: "Workout plans loaded successfully",
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

    workoutPlanModel.findOne({ _id: req.body._id })
        .populate("customerId")
        .populate("trainerId")
        .then(plan => {
            if (!plan) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Workout plan not found"
                });
            }

            res.json({
                status: 200,
                success: true,
                message: "Workout plan fetched successfully",
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
        workoutPlanModel.findOne({ _id: req.body._id })
            .then(plan => {
                if (!plan) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Workout plan not found"
                    });
                } else {
                    if (req.body.customerId) plan.customerId = req.body.customerId;
                    if (req.body.trainerId) plan.trainerId = req.body.trainerId;
                    if (req.body.workoutDescription) plan.workoutDescription = req.body.workoutDescription;
                    if (req.body.duration) plan.duration = req.body.duration;
                    if (req.body.exercises) plan.exercises= req.body.exercises.split(",").map(exercise => exercise.trim()); // Split exercises by comma and trim whitespace

                    
                    plan.save()
                        .then(updatedPlan => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Workout plan updated successfully",
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

    workoutPlanModel.find()
        .populate("customerId")
        .populate("trainerId")
        .skip(skip)
        .limit(limit)
        .then(plans => {
            workoutPlanModel.countDocuments()
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

    workoutPlanModel.deleteOne({ _id: req.body._id })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Workout plan not found"
                });
            }

            res.json({
                status: 200,
                success: true,
                message: "Workout plan deleted successfully"
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to delete workout plan",
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
        workoutPlanModel.findOne({ _id: req.body._id })
            .then((workoutPlanData) => {
                if (!workoutPlanData) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "workout plan not found!!",
                    });
                }
                else {
                    workoutPlanData.isPublic = req.body.status;
                    workoutPlanData.save()
                        .then(() => {
                            var statusMessage = req.body.status ? "public" : "private";
                            res.send({
                                status: 200,
                                success: true,
                                message: "workout plan " + statusMessage + " successfully",
                                data: workoutPlanData
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
module.exports = { add, getall, getSingle, update, getPagination, deleteOne,changestatus };
