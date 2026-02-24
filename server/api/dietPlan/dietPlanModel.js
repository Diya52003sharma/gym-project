const mongoose = require("mongoose");

// Diet Plan Model
const dietPlanSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },//optional
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainer" },
    dietPlanName: { type: String, default: "" },
    restrictions: { type: String, default: "" },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now() },
    isPublic: { type: Boolean, default: false },
});
module.exports = mongoose.model("dietPlans", dietPlanSchema);