const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://amardeepsingh786786_db_user:512@cluster0.9hi1vmv.mongodb.net/?appName=Cluster0")
    .then(() => {
        console.log('Db Connected')
    })
    .catch((err) => {
        console.log("Db Error", err)
    })


