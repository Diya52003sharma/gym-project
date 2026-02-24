const mongoose = require('mongoose')
const customerSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    gender: { type: String, default: '' },
    profile: { type: String, default: '/Noimage.jpg' },
    contact: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'user' },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})
module.exports = mongoose.model('customer', customerSchema)