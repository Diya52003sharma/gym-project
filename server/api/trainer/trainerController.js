const Trainer = require('./trainerModel')
const User = require('../user/userModel')
const bcrypt = require('bcrypt')
const { uploadImg } = require("../../utilities/helper");

const add = async (req, res) => {
    let validation = ''
    if (!req.body.name)
        validation += ' name is required '
    if (!req.body.email)
        validation += ' email is required '
    if (!req.body.password)
        validation += ' password is required '
    if (!req.body.contact)
        validation += ' contact is required '
    if (!req.body.address)
        validation += ' address is required '
    if (!req.body.experience)
        validation += ' experience is required '
    if (!req.file)
        validation += ' profile is required '

    if (!!validation) {
        return res.send({ success: false, status: 403, message: "validation Error:" + validation })
    }
    else {
        let imgUrl = "Image not uploaded";
        if (req.file) {
            try {
                const profileUrl = await uploadImg(req.file.buffer, `gymtracker/trainer/${Date.now()}`);
                imgUrl = profileUrl;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.json({
                    status: 500,
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        let prev = await User.findOne({ email: req.body.email })

        if (prev != null) {
            res.send({ success: false, status: 409, message: "Email Already Exists" })
        }
        else {
            let total = await Trainer.countDocuments()
            let newTrainer = new Trainer()
            newTrainer.autoId = total + 1
            newTrainer.name = req.body.name
            newTrainer.email = req.body.email
            newTrainer.address = req.body.address
            newTrainer.experience = req.body.experience
            newTrainer.profile = imgUrl
            newTrainer.contact = req.body.contact
            await newTrainer.save()
                .then(async (savedTrainer) => {
                    let totalUser = await User.countDocuments()
                    let newUser = new User()
                    newUser.autoId = totalUser + 1
                    newUser.name = req.body.name
                    newUser.email = req.body.email
                    newUser.trainerId = savedTrainer._id
                    newUser.userType = 2
                    newUser.password = bcrypt.hashSync(req.body.password, 10);
                    await newUser.save().then((savedUser) => {
                        newTrainer.userId = savedUser._id
                        newTrainer.save().then(() => {
                            res.send({
                                success: true,
                                status: 200,
                                message: "Trainer Registered",
                                data: savedTrainer
                            })
                        }).catch(() => {
                            res.send({ success: false, status: 500, message: err.message })
                        })



                    }).catch((err) => {
                        res.send({ success: false, status: 500, message: err.message })
                    })

                }).catch((err) => {
                    res.send({ success: false, status: 500, message: err.message })

                })
        }
    }
}

const update = async(req, res) => {
    let validation = ''
    if (!req.body._id)
        validation += '_id is require'

    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        let imgUrl = "Image not uploaded";
        if (req.file) {
            try {
                const profileUrl = await uploadImg(req.file.buffer, `gymtracker/trainer/${Date.now()}`);
                imgUrl = profileUrl;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.json({
                    status: 500,
                    success: false,
                    message: "Image upload failed"
                });
            }
        }
        Trainer.findOne({ userId: req.body._id })
            .then(result => {
                console.log(result);
                
                if (result === null)
                    res.send({ success: false, status: 500, message: 'Trainer not found' })
                else {
                    if (!!req.body.name) {
                        result.name = req.body.name
                    }
                    if (!!req.body.email) {
                        result.email = req.body.email
                    }
                    if (!!req.body.contact) {
                        result.contact = req.body.contact
                    }
                    if (!!req.body.address) {
                        result.address = req.body.address
                    }
                    if (!!req.body.experience) {
                        result.experience = req.body.experience
                    }
                    if (!!req.file) {
                        result.profile = imgUrl;
                    }
                    result.save()
                        .then(updatedResult => {
                            User.findOne({ _id: req.body._id }).then((userData) => {
                                if (userData == null) {
                                    res.send({ success: false, status: 500, message: 'Trainer not found' })
                                }
                                else {
                                    if (!!req.body.name) {
                                        userData.name = req.body.name
                                    }
                                    if (!!req.body.email) {
                                        userData.email = req.body.email
                                    }
                                    userData.save().then(() => {
                                        res.send({ success: true, status: 200, message: "Update Successfully", data: updatedResult })

                                    }).catch(error => {
                                        res.send({ success: false, status: 500, message: error.message })
                                    })
                                }
                            }).catch(error => {
                                res.send({ success: false, status: 500, message: error.message })
                            })
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

const block = (req, res) => {
    let validation = ""

    if (!req.body._id) {
        validation += "_id is required "
    }
    if (req.body.status == null) {
        validation += "status is required"
    }

    if (!!validation) {
        res.send({ success: false, status: 500, message: validation })
    }
    else {
        Trainer.findOne({ _id: req.body._id })
            .then((data) => {
                if (data == null) {
                    res.send({ success: false, status: 500, message: "Trainer Does not exist" })
                }
                else {
                    data.status = req.body.status
                    data.save().then(async () => {
                        await User.findOne({ trainerId: req.body._id }).then((userData) => {
                            if (userData == null) {
                                res.send({ success: false, status: 500, message: "User Does not exist" })

                            }
                            else {
                                userData.status = req.body.status
                                userData.save().then((updatedData) => {
                                    res.send({ success: true, status: 200, message: "Status Changed Successfully" })
                                })
                                    .catch((err) => {
                                        res.send({ success: false, status: 500, message: err.message })
                                    })
                            }
                        })
                    }).catch((err) => {
                        res.send({ success: false, status: 500, message: err.message })
                    })
                }
            })
            .catch((err) => {
                res.send({ success: false, status: 500, message: err.message })
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
        Trainer.findOne({ userId: req.body._id }).populate('userId')
            .then((data) => {
                if (data == null) {
                    res.send({ success: false, status: 500, message: "Trainer Does not exist" })
                }
                else
                    res.send({ success: true, status: 200, message: "Trainer Loaded", data: data })
            })
            .catch((err) => {
                res.send({ success: false, status: 500, message: err.message })
            })
    }
}


const all = (req, res) => {
    Trainer.find(req.body).populate('userId')
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "All Trainers Loaded",
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





module.exports = { add, update, block, single, all }



