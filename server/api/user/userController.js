const User = require('./userModel')
const jwt = require('jsonwebtoken')
const secretKey = '1q2w3e4r5t'
const bcrypt = require('bcrypt')


const login = (req, res) => {
    let validation = ''
    if (!req.body.email)
        validation += " Email is required "
    if (!req.body.password)
        validation += ' Password is required '
    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        User.findOne({ email: req.body.email })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'No user Found' })
                else {
                    if (bcrypt.compareSync(req.body.password, result.password)) {
                        if (result.status) {
                            let payload = {
                                _id: result._id,
                                name: result.name,
                                email: result.email,
                                UserType: result.userType
                            }
                            let token = jwt.sign(payload, secretKey, { expiresIn: '24h' })

                            res.send({ success: true, status: 200, message: 'Login Successfull', data: result, token: token })
                        }
                        else
                            res.send({ success: false, status: 500, message: 'Your Account Is Blocked' })
                    }
                    else {
                        res.send({ success: false, status: 500, message: "Invalid username Password" })
                    }
                }

            })
            .catch(err => {
                res.send({ success: false, status: 500, message: err })
            })
    }
}

const changePassword = (req, res) => {
    let validation = ''
    if (!req.body._id) {
        validation += '_id is required '
    }
    if (!req.body.currentPassword) {
        validation += 'currentPassword is required '
    }
    if (!req.body.newPassword) {
        validation += 'newPassword is required '
    }
    if (!req.body.confirmPassword) {
        validation += 'confirmPassword is required '
    }

    if (!!validation) {
        res.send({
            success: false,
            status: 400,
            message: 'Validation error: ' + validation
        })
    }
    else {
        User.findOne({ _id: req.body._id })
            .then((userData) => {
                if (userData == null) {
                    res.send({
                        success: false,
                        status: 404,
                        message: "Account does not exist"
                    })

                }
                else {
                    if (bcrypt.compareSync(req.body.currentPassword, userData.password)) {

                        if (req.body.newPassword == req.body.confirmPassword) {
                            userData.password = bcrypt.hashSync(req.body.newPassword, 10)
                            userData.save().then((userData) => {
                                res.send({
                                    success: true,
                                    status: 200,
                                    message: "Password Changed",
                                    data: userData

                                })

                            }).catch((err) => {
                                res.send({
                                    success: false,
                                    status: 403,
                                    message: err.message
                                })

                            })
                        }
                        else {
                            res.json({
                                status: 422,
                                success: false,
                                message: "New password and confirm password not matched"
                            })
                        }
                    }
                    else {
                        res.send({
                            success: false,
                            status: 403,
                            message: 'Current Password does not match'
                        })

                    }

                }

            }).catch((err) => {
                res.send({
                    success: false,
                    status: 403,
                    message: err.message
                })


            })
    }
}


module.exports = {login,changePassword}