const Session = require('./sessionModel')


const add = async (req, res) => {
    let validation = ''
    if (!req.body.trainerId)
        validation += ' trainerId is required '
    if (!req.body.customerId)
        validation += ' customerId is required '
    if (!req.body.week)
        validation += ' week is required '
    if (!req.body.diet)
        validation += ' diet is required '
    if (!req.body.day1)
        validation += ' day1 is required '
    if (!req.body.day2)
        validation += ' day2 is required '
    if (!req.body.day3)
        validation += ' day3 is required '
    if (!req.body.day4)
        validation += ' day4 is required '
    if (!req.body.day5)
        validation += ' day5 is required '
    if (!req.body.day6)
        validation += ' day6 is required '
    if (!!validation) {
        return res.send({ success: false, status: 403, message: "validation Error:" + validation })
    }
    else {
        let total = await Session.countDocuments()
        let newSession = new Session()
        newSession.autoId = total + 1
        newSession.trainerId = req.body.trainerId
        newSession.customerId = req.body.customerId
        newSession.week = req.body.week
        newSession.diet = req.body.diet
        newSession.day1 = req.body.day1
        newSession.day2 = req.body.day2
        newSession.day3 = req.body.day3
        newSession.day4 = req.body.day4
        newSession.day5 = req.body.day5
        newSession.day6 = req.body.day6
        await newSession.save()
            .then(async (savedItem) => {
                res.send({
                    success: true,
                    status: 200,
                    message: " Session Added Successfully",
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
        Session.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'Session not found' })
                else {
                    if (!!req.body.trainerId)
                        result.trainerId = req.body.trainerId
                    if (!!req.body.customerId)
                        result.customerId = req.body.customerId
                    if (!!req.body.week)
                        result.week = req.body.week
                    if (!!req.body.diet)
                        result.diet = req.body.diet
                    if (!!req.body.day1)
                        result.day1 = req.body.day1
                    if (!!req.body.day2)
                        result.day2 = req.body.day2
                    if (!!req.body.day3)
                        result.day3 = req.body.day3
                    if (!!req.body.day4)
                        result.day4 = req.body.day4
                    if (!!req.body.day5)
                        result.day5 = req.body.day5
                    if (!!req.body.day6)
                        result.day6 = req.body.day6
                    result.save()
                        .then(updatedResult => {
                            res.send({ success: true, status: 200, message: "Session Update Successfully", data: updatedResult })
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
    if (!req.body.status)
        validation += 'status is required'
    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        Session.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'No Session found' })
                else {
                    if (!!req.body.status)
                        result.status = req.body.status
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
        Session.findOne({ _id: req.body._id }).populate('trainerId').populate('customerId')
            .then((data) => {
                if (data == null) {
                    res.send({ success: false, status: 500, message: "Session Does not exist" })
                }
                else
                    res.send({ success: true, status: 200, message: "Single Session Loaded", data: data })
            })
            .catch((err) => {
                res.send({ success: false, status: 500, message: err.message })
            })
    }
}


const all = (req, res) => {
    Session.find(req.body).populate('trainerId').populate('customerId')
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "All Sessions Loaded",
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