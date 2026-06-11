const dietPlanModel = require("./dietPlanModel");
const axios = require("axios");

/* ================= ADD ================= */

const add = async (req, res) => {
    try {
        const newDietPlan = new dietPlanModel({
            customerId: req.body.customerId,
            trainerId: req.body.trainerId,
            dietPlanName: req.body.dietPlanName,
            restrictions: req.body.restrictions,
            description: req.body.description,
            duration: req.body.duration,
            isPublic: req.body.isPublic
        });

        const data = await newDietPlan.save();

        res.json({
            success: true,
            status: 200,
            message: "Diet plan added successfully",
            data
        });

    } catch (err) {
        res.json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


/* ================= GEMINI GENERATE ================= */

const generateDietPlan = async (req, res) => {
    try {

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

        res.status(500).json({
            success: false,
            message: "Gemini API failed",
            error: error.response?.data || error.message
        });
    }
};


/* ================= GET ALL ================= */

const getall = async (req, res) => {
    try {

        const plans = await dietPlanModel.find()
            .populate("customerId")
            .populate("trainerId");

        res.json({
            success: true,
            status: 200,
            data: plans
        });

    } catch (err) {

        res.json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


/* ================= GET SINGLE ================= */

const getSingle = async (req, res) => {

    try {

        const plan = await dietPlanModel.findById(req.body._id)
            .populate("customerId")
            .populate("trainerId");

        if (!plan) {
            return res.json({
                success: false,
                status: 404,
                message: "Diet plan not found"
            });
        }

        res.json({
            success: true,
            status: 200,
            data: plan
        });

    } catch (err) {

        res.json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


/* ================= UPDATE ================= */

const update = async (req, res) => {

    try {

        const updatedPlan = await dietPlanModel.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            status: 200,
            message: "Updated successfully",
            data: updatedPlan
        });

    } catch (err) {

        res.json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


/* ================= PAGINATION ================= */

const getPagination = async (req, res) => {

    try {

        let limit = Number(req.body.limit);
        let page = Number(req.body.pageno);

        let skip = (page - 1) * limit;

        const plans = await dietPlanModel.find()
            .populate("customerId")
            .populate("trainerId")
            .skip(skip)
            .limit(limit);

        const count = await dietPlanModel.countDocuments();

        res.json({
            success: true,
            status: 200,
            totaldocuments: count,
            data: plans
        });

    } catch (err) {

        res.json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


/* ================= DELETE ================= */

const deleteOne = async (req, res) => {

    try {

        await dietPlanModel.findByIdAndDelete(req.body._id);

        res.json({
            success: true,
            status: 200,
            message: "Deleted successfully"
        });

    } catch (err) {

        res.json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


/* ================= CHANGE STATUS ================= */

const changestatus = async (req, res) => {

    try {

        const plan = await dietPlanModel.findById(req.body._id);

        if (!plan) {
            return res.json({
                success: false,
                status: 404,
                message: "Diet plan not found"
            });
        }

        plan.isPublic = req.body.status;

        await plan.save();

        res.json({
            success: true,
            status: 200,
            message: "Status updated successfully"
        });

    } catch (err) {

        res.json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


/* ================= EXPORT ================= */

module.exports = {
    add,
    generateDietPlan,
    getall,
    getSingle,
    update,
    getPagination,
    deleteOne,
    changestatus
};