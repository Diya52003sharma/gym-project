const mongoose = require('mongoose')
const packageSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: '' },
    duration: { type: String, default: '' },
    price: { type: String, default: '' },
    features: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})
module.exports = mongoose.model('package', packageSchema)