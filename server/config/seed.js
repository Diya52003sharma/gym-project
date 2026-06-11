const user = require('../api/user/userModel')
const bcrypt = require('bcrypt');


user.findOne({ email: 'admin@gmail.com' })
    .then(result => {
        if (result == null) {
            let admin = new user({
                autoId: 1,
                name: 'admin',
                email: 'admin@gmail.com',
                password: bcrypt.hashSync('1234', 10),
                userType: 1
            })
            admin.save().then(saveResult => {
                console.log('Admin Created');
            })
                .catch(err => {
                    console.log('Error In Admin', err);
                })
        }
        else {
            console.log("Admin Already Exist");
        }
    })
    .catch(err => {
        console.log('Error In Admin', err);
    })