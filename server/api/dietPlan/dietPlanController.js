const dietPlanModel = require("./dietPlanModel");
const axios = require("axios");



/* ================= ADD DIET PLAN ================= */

const add = (req, res) => {
    var errMsg = [];
    if (!req.body.customerId) errMsg.push("customerId is required");
    if (!req.body.trainerId) errMsg.push("trainerId is required");
    if (!req.body.dietPlanName) errMsg.push("dietPlanName is required");
    if (!req.body.duration) errMsg.push("duration is required");
    if (!req.body.restrictions) errMsg.push("restrictions is required");
    if (!req.body.description) errMsg.push("description is required");

    if (errMsg.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: errMsg
        });
    }

    const newDietPlan = new dietPlanModel({
        customerId: req.body.customerId,
        trainerId: req.body.trainerId,
        dietPlanName: req.body.dietPlanName,
        restrictions: req.body.restrictions,
        description: req.body.description,
        duration: req.body.duration,
        isPublic: req.body.isPublic
    });

    newDietPlan.save()
        .then(planData => {
            res.json({
                status: 200,
                success: true,
                message: "Diet plan added successfully",
                data: planData
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to save diet plan",
                errmsg: err.message
            });
        });
};



/* ================= GEMINI DIET GENERATOR ================= */


// const axios = require("axios");

const generateDietPlan = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { age, height, weight, meals, purpose, week } = req.body;

    const prompt = `
      Age: ${age}
      Height: ${height}
      Weight: ${weight}
      Meals per day: ${meals}
      Duration: ${week} weeks
      Purpose: ${purpose}
      
      Generate a detailed weekly diet plan only.
    `;

 const response = await axios.post(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  },
  {
    headers: {
      "Content-Type": "application/json"
    },
    params: {
      key: process.env.GEMINI_API_KEY
    }
  }
);

    const text =
      response.data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      data: text
    });

  } catch (error) {
    console.log("FULL GEMINI ERROR:");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Gemini API failed",
      error: error.response?.data || error.message
    });
  }
};

// module.exports = { generateDietPlan };


/* ================= GET ALL ================= */

const getall = (req, res) => {
    dietPlanModel.find()
        .populate("customerId")
        .populate("trainerId")
        .then(plans => {
            res.json({
                status: 200,
                success: true,
                message: "Diet plans loaded successfully",
                data: plans
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err.message
            });
        });
};



/* ================= GET SINGLE ================= */

const getSingle = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 400,
            success: false,
            message: "_id is required"
        });
    }

    dietPlanModel.findOne({ _id: req.body._id })
        .populate("customerId")
        .populate("trainerId")
        .then(plan => {
            if (!plan) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Diet plan not found"
                });
            }

            res.json({
                status: 200,
                success: true,
                message: "Diet plan fetched successfully",
                data: plan
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err.message
            });
        });
};



/* ================= UPDATE ================= */

const update = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "_id is required!!"
        });
    }

    dietPlanModel.findOne({ _id: req.body._id })
        .then(plan => {
            if (!plan) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Diet plan not found"
                });
            }

            if (req.body.customerId) plan.customerId = req.body.customerId;
            if (req.body.trainerId) plan.trainerId = req.body.trainerId;
            if (req.body.dietPlanName) plan.dietPlanName = req.body.dietPlanName;
            if (req.body.restrictions) plan.restrictions = req.body.restrictions;
            if (req.body.description) plan.description = req.body.description;
            if (req.body.duration) plan.duration = req.body.duration;
            if (req.body.isPublic !== undefined) plan.isPublic = req.body.isPublic;

            return plan.save();
        })
        .then(updatedPlan => {
            res.json({
                status: 200,
                success: true,
                message: "Diet plan updated successfully",
                data: updatedPlan
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err.message
            });
        });
};



/* ================= DELETE ================= */

const deleteOne = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "_id is required"
        });
    }

    dietPlanModel.deleteOne({ _id: req.body._id })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json({
                    status: 404,
                    success: false,
                    message: "Diet plan not found"
                });
            }

            res.json({
                status: 200,
                success: true,
                message: "Diet plan deleted successfully"
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to delete diet plan",
                errmsg: err.message
            });
        });
};



module.exports = {
    add,
    generateDietPlan,
    getall,
    getSingle,
    update,
    deleteOne
};