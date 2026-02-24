const router = require('express').Router()
const multer = require('multer')
const userController = require('../api/user/userController')
const assignTrainerController = require('../api/assigntrainer/assignTrainerController')
const sessionController = require('../api/session/sessionController')
const reportController = require('../api/report/reportController')
const workOutController = require('../api/workoutPlan/workoutPlanController')
const dietPlanController = require('../api/dietPlan/dietPlanController')
const queryController = require('../api/query/queryController')
const trainerController = require('../api/trainer/trainerController')

//login
router.post('/login', userController.login)

router.use(require('../middleware/tokenChecker'))
// assign Trainer

router.post("/assign/customers", assignTrainerController.all)
router.post("/assign/single", assignTrainerController.single)


// session
router.post("/session/add", sessionController.add)
router.post("/session/update", sessionController.update)
router.post("/session/status", sessionController.changeStatus)
router.post("/session/single", sessionController.single)
router.post("/session/all", sessionController.all)

// Report
router.post("/report/add", reportController.add)
router.post("/report/update", reportController.update)
router.post("/report/status", reportController.changeStatus)
router.post("/report/single", reportController.single)
router.post("/report/all", reportController.all)

//workout
router.post("/workout/add", workOutController.add)
router.post("/workout/all", workOutController.getall)
router.post("/workout/update", workOutController.update)
router.post("/workout/delete", workOutController.deleteOne)
router.post("/workout/changestatus", workOutController.changestatus)
router.post("/workout/single", workOutController.getSingle)


//dietPlan
router.post("/diet/add", dietPlanController.add)
router.post("/diet/all", dietPlanController.getall) 
router.post("/diet/update", dietPlanController.update)
router.post("/diet/delete", dietPlanController.deleteOne)
router.post("/diet/changestatus", dietPlanController.changestatus)
router.post("/diet/getsingle", dietPlanController.getSingle)



//query
router.post("/query/add", queryController.add)
router.post("/query/update", queryController.update)

router.post('/trainer/single',trainerController.single)
router.post('/trainer/update',trainerController.update)













module.exports = router