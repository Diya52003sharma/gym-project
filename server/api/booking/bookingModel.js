const mongoose = require('mongoose')
const bookingSchema = new mongoose.Schema({
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'package', },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    bookingDate: { type: Date, },
    createdAt: { type: Date, default: Date.now },
    paymentType: { type: Number, default: 1 }, //1- online 2 - cash
    paymentStatus: { type: Number, default: 1 }, //1-pending 2-paid 3-cancel
    stripeSessionId: { type: String, default: "" },
    status: { type: Number, default: 1 }, // 1- pending 2- approve 3- decline 4- cancel 5- complete
    isTrainerAssigned: { type:Boolean, default:false}
})
const Booking=mongoose.model("booking",bookingSchema)
module.exports=Booking