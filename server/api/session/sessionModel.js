const mongoose = require('mongoose')
const sessionSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'trainer' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    diet: { type: String, default: '' },
    week: { type: Date },
    day1: { type: String, default: '' },
    day2: { type: String, default: '' },
    day3: { type: String, default: '' },
    day4: { type: String, default: '' },
    day5: { type: String, default: '' },
    day6: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})
module.exports = mongoose.model('session', sessionSchema)