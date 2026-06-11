const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'customer'},
    trainerId: {type: mongoose.Schema.Types.ObjectId, ref: 'trainer'},
    password: { type: String, default: '' },
    userType: { type: Number, default: 3 },// 1 - Admin, 2 - trainer 3- customer
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})
module.exports = mongoose.model('user', userSchema)