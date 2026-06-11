const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" ,default:null},//optional
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainer" },
    workoutDescription: { type: String, default: "" },
    duration: { type: String, default: "" },
    exercises: [{type: String, default: ""}], // Array of exercises
    createdAt: { type: Date, default: Date.now()},
    isPublic: { type: Boolean, default: false },
}); 
module.exports = mongoose.model("workoutPlans", workoutPlanSchema);