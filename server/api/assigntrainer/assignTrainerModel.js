const mongoose = require('mongoose')
const assignTrainerSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer', default: null },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'trainer', default: null },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'package', default: null },
    start: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})
module.exports = mongoose.model('assigntrainer', assignTrainerSchema)