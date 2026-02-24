const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer",default:null },//optional
    // trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainers" ,default:null},
    contact: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: Boolean, default:false }, //false for pending,true for resolved
    createdAt: { type: Date, default: Date.now() }
});
module.exports = mongoose.model("queries", querySchema);