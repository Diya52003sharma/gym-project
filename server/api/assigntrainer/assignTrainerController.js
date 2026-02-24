const bookingModel = require('../booking/bookingModel');
const AssignTrainer = require('./assignTrainerModel')


const assignTrainer = async (req, res) => {
    let validation = '';
    if (!req.body.customerId)
        validation += ' customerId is required ';
    if (!req.body.trainerId)
        validation += ' trainerId is required ';
    if (!req.body.packageId)
        validation += ' packageId is required ';
    if (!req.body.start)
        validation += ' start is required ';

    if (!!validation) {
        return res.send({ success: false, status: 403, message: "Validation Error:" + validation });
    } else {
        try {
            // Check if the trainer is already assigned to this customer
            const existingAssignment = await AssignTrainer.findOne({$and: [{customerId: req.body.customerId},{ trainerId:req.body.trainerId},{packageId:req.body.packageId}] });
            if (existingAssignment) {
                return res.send({ success: false, status: 409, message: "Trainer already assigned to this customer" });
            }

            // If not already assigned, proceed with creating the assignment
            let total = await AssignTrainer.countDocuments();
            let newObj = new AssignTrainer();

            await bookingModel.findOne({_id:req.body.bookingId}).then(async(booking)=>{
                booking.isTrainerAssigned = true;
                await booking.save();
            })
            newObj.autoId = total + 1;
            newObj.customerId = req.body.customerId;
            newObj.trainerId = req.body.trainerId;
            newObj.packageId = req.body.packageId;
            newObj.start = req.body.start;

            await newObj.save();
            res.send({
                success: true,
                status: 200,
                message: "Trainer Assigned Successfully",
                data: newObj
            });
        } catch (err) {
            res.send({ success: false, status: 500, message: err.message });
        }
    }
};



const update = (req, res) => {
    let validation = ''
    if (!req.body._id)
        validation += '_id is require'

    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        AssignTrainer.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'data not found' })
                else {
                    if (!!req.body.customerId)
                        result.customerId = req.body.customerId
                    if (!!req.body.trainerId)
                        result.trainerId = req.body.trainerId
                    if (!!req.body.packageId)
                        result.packageId = req.body.packageId
                    if (!!req.body.start)
                        result.start = req.body.start
                    result.save()
                        .then(updatedResult => {
                            res.send({ success: true, status: 200, message: "Update Successfully", data: updatedResult })
                        })
                        .catch(error => {
                            res.send({ success: false, status: 500, message: error.message })
                        })
                }
            })
            .catch(error => {
                res.send({ success: false, status: 500, message: error.message })
            })

    }
}

const single = (req, res) => {
    let validation = ""
    if (!req.body._id) {
        validation = "_id is required"
    }
    if (!!validation) {
        res.send({ success: false, status: 500, message: validation })
    }
    else {
        AssignTrainer.findOne({ _id: req.body._id }).populate('customerId').populate('trainerId').populate('packageId')
            .then((data) => {
                if (data == null) {
                    res.send({ success: false, status: 500, message: "Data Does not exist" })
                }
                else
                    res.send({ success: true, status: 200, message: "Loaded Successfully", data: data })
            })
            .catch((err) => {
                res.send({ success: false, status: 500, message: err.message })
            })
    }
}


const all = (req, res) => {
    AssignTrainer.find(req.body).populate('customerId').populate('trainerId').populate('packageId')
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "All Customers Loaded",
                data: data,
                total: data.length
            })
        })
        .catch((err) => {
            res.send({
                success: false,
                status: 500,
                message: err.message
            })
        })
}







module.exports = { assignTrainer,update, single, all }