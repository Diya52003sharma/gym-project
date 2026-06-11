const mongoose = require('mongoose')
const reportSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'trainer' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    week: { type: Date },
    sessionScore: { type: Number, default: 0 }, //out of 10
    dietScore: { type: Number, default: 0 }, //out of 10
    height: { type: Number, default: 0 },  // in cm
    weight: { type: Number, default: 0 },  // in kg
    BMI: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})
module.exports = mongoose.model('report', reportSchema)