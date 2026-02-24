const queryModel = require("./queryModel");

const add = (req, res) => {
    var errMsgs = [];
    if (!req.body.contact) errMsgs.push("contact is required");
    if (!req.body.subject) errMsgs.push("subject is required");
    if (!req.body.message) errMsgs.push("message is required");
    if (!req.body.customerId ) errMsgs.push("Either customerId or trainerId is required");

    if (errMsgs.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    const newQuery = new queryModel({
        customerId: req.body.customerId || null,
        // trainerId: req.body.trainerId || null,
        contact: req.body.contact,
        subject: req.body.subject,
        message: req.body.message,
        status: false
    });

    newQuery.save()
        .then(queryData => {
            res.json({
                status: 200,
                success: true,
                message: "Query submitted successfully",
                data: queryData
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to submit query",
                errmsg: err.message
            });
        });
};




const getall = (req, res) => {
    queryModel.find()
    .populate("customerId")
        .then(queries => {
            res.json({
                status: 200,
                success: true,
                message: "Queries loaded successfully",
                data: queries
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

    queryModel.findOne({_id:req.body._id})
    .populate("customerId")

        .then(query => {
            if (!query) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Query not found"
                });
            }

            res.json({
                status: 200,
                success: true,
                message: "Query fetched successfully",
                data: query
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
        return res.json({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    queryModel.findOne({_id:req.body._id})
        .then(query => {
            if (!query) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Query not found"
                });
            }

            if (req.body.customerId !== undefined) query.customerId = req.body.customerId;
            // if (req.body.trainerId !== undefined) query.trainerId = req.body.trainerId;
            if (req.body.contact !== undefined) query.contact = req.body.contact;
            if (req.body.subject !== undefined) query.subject = req.body.subject;
            if (req.body.message !== undefined) query.message = req.body.message;
            if (req.body.status !== undefined) query.status = req.body.status;

            query.save()
                .then(updatedQuery => {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Query updated successfully",
                        data: updatedQuery
                    });
                })
                .catch(err => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Failed to update query",
                        errmsg: err.message
                    });
                });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Error finding query",
                errmsg: err.message
            });
        });
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

    queryModel.find()
        .skip(skip)
        .limit(limit)
        .then(queries => {
            queryModel.countDocuments()
                .then(count => {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Data loaded",
                        totaldocuments: count,
                        data: queries
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

    queryModel.findOne({ _id: req.body._id })
        .then(query => {
            if (!query) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Query not found"
                });
            }

            queryModel.deleteOne({ _id: req.body._id })
                .then(() => {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Query deleted successfully",
                        data: query
                    });
                })
                .catch(err => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Failed to delete query",
                        errmsg: err.message
                    });
                });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Error finding query",
                errmsg: err.message
            });
        });
};


const changeStatus = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "_id is required"
        });
    }

    queryModel.findOne({_id:req.body._id})
        .then(query => {
            if (!query) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Query not found"
                });
            }

            query.status = !query.status;
            query.save()
                .then(updatedQuery => {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Query status updated successfully",
                        data: updatedQuery
                    });
                })
                .catch(err => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Failed to update query status",
                        errmsg: err.message
                    });
                });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Error finding query",
                errmsg: err.message
            });
        });
};

module.exports = { add, getall, getSingle, update, getPagination, deleteOne, changeStatus };