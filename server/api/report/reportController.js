const Report = require('./reportModel')

const add = async (req, res) => {
    let validation = ''
    if (!req.body.trainerId)
        validation += ' trainerId is required '
    if (!req.body.customerId)
        validation += ' customerId is required '
    if (!req.body.week)
        validation += ' week is required '
    if (!req.body.sessionScore)
        validation += ' sessionScore is required '
    if (!req.body.dietScore)
        validation += ' dietScore is required '
    if (!req.body.height)
        validation += ' height is required '
    if (!req.body.weight)
        validation += ' weight is required '
    if (!!validation) {
        return res.send({ success: false, status: 403, message: "validation Error:" + validation })
    }
    else {
        const heightIncm = req.body.height
        const weight = req.body.weight
        const heightInM = heightIncm / 100;
        const bmi = (weight / (heightInM * heightInM)).toFixed(2)
        let total = await Report.countDocuments()
        let newReport = new Report()
        newReport.autoId = total + 1
        newReport.trainerId = req.body.trainerId
        newReport.customerId = req.body.customerId
        newReport.week = req.body.week
        newReport.sessionScore = req.body.sessionScore
        newReport.dietScore = req.body.dietScore
        newReport.height = req.body.height
        newReport.weight = req.body.weight
        newReport.BMI = bmi
        await newReport.save()
            .then(async (savedItem) => {
                res.send({
                    success: true,
                    status: 200,
                    message: " Report Added Successfully",
                    data: savedItem
                })

            }).catch((err) => {
                res.send({ success: false, status: 500, message: err.message })

            })
    }
}


const update = (req, res) => {
    let validation = ''
    if (!req.body._id)
        validation += '_id is require'

    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        Report.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'Report not found' })
                else {
                    if (!!req.body.trainerId) {
                        result.trainerId = req.body.trainerId
                    }

                    if (!!req.body.customerId) {
                        result.customerId = req.body.customerId
                    }

                    if (!!req.body.week) {
                        result.week = req.body.week
                    }

                    if (!!req.body.sessionScore) {
                        result.sessionScore = req.body.sessionScore
                    }

                    if (!!req.body.dietScore) {
                        result.dietScore = req.body.dietScore
                    }

                    if (!!req.body.height) {
                        result.height = req.body.height
                    }

                    if (!!req.body.weight) {
                        result.weight = req.body.weight
                    }

                    // BMI
                    if (!!req.body.weight && !!req.body.height) {
                        const heightIncm = req.body.height
                        const weight = req.body.weight
                        const heightInM = heightIncm / 100;
                        const bmi = (weight / (heightInM * heightInM)).toFixed(2)
                        result.BMI = bmi

                    }
                    if (!!req.body.weight) {
                        const heightIncm = result.height
                        const weight = req.body.weight
                        const heightInM = heightIncm / 100;
                        const bmi = (weight / (heightInM * heightInM)).toFixed(2)
                        result.BMI = bmi


                    }
                    if (!!req.body.height) {
                        const heightIncm = req.body.height
                        const weight = result.weight
                        const heightInM = heightIncm / 100;
                        const bmi = (weight / (heightInM * heightInM)).toFixed(2)
                        result.BMI = bmi


                    }
                    // Bmi

                    result.save()
                        .then(updatedResult => {
                            res.send({ success: true, status: 200, message: "Report Update Successfully", data: updatedResult })
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

const changeStatus = (req, res) => {
    let validation = ''
    if (!req.body._id)
        validation += '_id is require'
    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        Report.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'No Report found' })
                else {
                        result.status = false
                    result.save()
                        .then(updatedResult => {
                            res.send({ success: true, status: 200, message: "Status Changed Successfully", data: updatedResult })
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
        Report.findOne({ _id: req.body._id }).populate('trainerId').populate('customerId')
            .then((data) => {
                if (data == null) {
                    res.send({ success: false, status: 500, message: "Report Does not exist" })
                }
                else
                    res.send({ success: true, status: 200, message: "Single Report Loaded", data: data })
            })
            .catch((err) => {
                res.send({ success: false, status: 500, message: err.message })
            })
    }
}


const all = (req, res) => {
    Report.find(req.body).populate('trainerId').populate('customerId')
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "All Reports Loaded",
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






module.exports = { add, update, changeStatus, single, all }