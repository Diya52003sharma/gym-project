const router = require('express').Router()
const userController = require('../api/user/userController')
const customerController = require('../api/customer/customerController')
const bookingController = require('../api/booking/bookingController')
const packageController = require('../api/package/packageController')
const sessionController = require('../api/session/sessionController')
const reportController = require('../api/report/reportController')
const workOutController = require('../api/workoutPlan/workoutPlanController')
const dietPlanController = require('../api/dietPlan/dietPlanController')
const queryController = require('../api/query/queryController')
const multer = require("multer");
const storage = multer.memoryStorage();
const fileUpload = multer({ storage });

// Authentication
router.post('/login', userController.login)


router.post("/register", fileUpload.single('profile'), customerController.register)
router.post("/package/all", packageController.all)
router.post("/confirm-payment", bookingController.confirmPayment);
router.use(require('../middleware/tokenChecker'))

router.post("/update", fileUpload.single('profile'), customerController.update)
router.post("/profile", customerController.single)
router.post("/changePassword", userController.changePassword)

// Packages
router.post("/package/single", packageController.single)


// Book Package
router.post("/package/book", bookingController.bookPackage)
router.post("/package/book/all", bookingController.all)



// session
router.post("/session/single", sessionController.single)
router.post("/session/all", sessionController.all)

// report
router.post("/report/single", reportController.single)
router.post("/report/all", reportController.all)

//workout
router.post("/workout/all", workOutController.getall)
router.post("/workout/getsingle", workOutController.getSingle)
router.post("/workout/getpagination", workOutController.getPagination)


//diet
router.post("/diet/all", dietPlanController.getall)
router.post("/diet/getsingle", dietPlanController.getSingle)
router.post("/diet/getpagination", dietPlanController.getPagination)

router.post("/booking/add", bookingController.bookPackage)
router.post("/booking/pay", bookingController.pay)
router.post("/booking/all", bookingController.all)
router.post("/booking/getsingle", bookingController.single)

//query
router.post("/query/add", queryController.add)
router.post("/query/update", queryController.update)



module.exports = router