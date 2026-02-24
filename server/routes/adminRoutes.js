const router = require('express').Router()
const userController = require('../api/user/userController')
const customerController = require('../api/customer/customerController')
const trainerController = require('../api/trainer/trainerController')
const packageController = require('../api/package/packageController')
const assignTrainerController = require('../api/assigntrainer/assignTrainerController')
const bookingController = require('../api/booking/bookingController')
const reportController = require('../api/report/reportController')
const dashboardController = require('../api/dashboard/dashboardController')
const queryController = require('../api/query/queryController')
const multer = require("multer");
const storage = multer.memoryStorage();
const fileUpload = multer({ storage });


//login
router.post('/login', userController.login)
router.post("/package/all", packageController.all)
router.use(require('../middleware/tokenChecker'))

// Trainers Routes



router.post("/trainer/add", fileUpload.single('profile'), trainerController.add)
router.post("/trainer/update", fileUpload.single('profile'), trainerController.update)
router.post("/trainer/status", trainerController.block)
router.post("/trainer/single", trainerController.single)
router.post("/trainer/all", trainerController.all)
router.post("/trainer/changePassword", userController.changePassword)



// customer
router.post("/customer/status", customerController.changeStatus)
router.post("/customer/single", customerController.single)
router.post("/customer/all", customerController.all)



// Package Routes

router.post("/package/add", packageController.add)
router.post("/package/update", packageController.update)
router.post("/package/status", packageController.changeStatus)
router.post("/package/single", packageController.single)


// Assign Trainer

router.post("/trainer/assign", assignTrainerController.assignTrainer)
router.post("/trainer/assign/update", assignTrainerController.update)
router.post("/trainer/assign/all", assignTrainerController.all)
router.post("/trainer/assign/single", assignTrainerController.single)



// Book Package
router.post("/booking/all", bookingController.all)
router.post("/booking/status", bookingController.changeStatus)
router.post("/booking/single", bookingController.single)




// Report
router.post("/report/single", reportController.single)
router.post("/report/all", reportController.all)

router.post("/dashboard", dashboardController.dashboard) 



//workout




//query

router.post("/query/changestatus", queryController.changeStatus)
router.post("/query/getsingle", queryController.getSingle)
router.post("/query/all", queryController.getall)
router.post("/query/delete", queryController.deleteOne)




module.exports = router