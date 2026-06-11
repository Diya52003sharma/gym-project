const Package = require('./packageModel')


const add = async (req, res) => {
    let validation = ''
    if (!req.body.name) {
        validation += 'name is required '
    }
    if (!req.body.duration) {
        validation += ' duration is required '
    }
    if (!req.body.price) {
        validation += ' price is required '
    }
    if (!req.body.features) {
        validation += ' features is required '
    }

    if (!!validation) {
        return res.send({ success: false, status: 403, message: "validation Error:" + validation })
    }
    else {
        let totalPackages = await Package.countDocuments()
        let newPackage = new Package()
        newPackage.autoId = totalPackages + 1
        newPackage.name = req.body.name
        newPackage.duration = req.body.duration
        newPackage.price = req.body.price
        newPackage.features = req.body.features
        await newPackage.save()
            .then(async (savedPackage) => {
                res.send({
                    success: true,
                    status: 200,
                    message: "Package Added Successfully",
                    data: savedPackage
                })

            }).catch((err) => {
                console.log(err);
                
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
        Package.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'Package not found' })
                else {
                    if (!!req.body.name)
                        result.name = req.body.name
                    if (!!req.body.duration)
                        result.duration = req.body.duration
                    if (!!req.body.price)
                        result.price = req.body.price
                    if (!!req.body.features)
                        result.features = req.body.features

                    result.save()
                        .then(updatedResult => {
                            res.send({ success: true, status: 200, message: "Package Update Successfully", data: updatedResult })
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
    if (req.body.status == null)
        validation += 'status is required'
    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        Package.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'No Package found' })
                else {
                    if (req.body.status != null)
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
        Package.findOne({ _id: req.body._id })
            .then((data) => {
                if (data == null) {
                    res.send({ success: false, status: 500, message: "Package Does not exist" })
                }
                else
                    res.send({ success: true, status: 200, message: "Single Package Loaded", data: data })
            })
            .catch((err) => {
                res.send({ success: false, status: 500, message: err.message })
            })
    }
}



const all = (req, res) => {
    Package.find(req.body).sort({ createdAt: -1 })
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "All Packages Loaded",
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









module.exports = { add, update, changeStatus,single, all  }