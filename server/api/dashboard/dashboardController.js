const Trainers = require('../trainer/trainerModel')
const Members = require('../customer/customerModel')
const Package = require('../package/packageModel')
const Booking = require('../booking/bookingModel')

const dashboard = async (req, res) => {
    let totalTrainers = await Trainers.countDocuments()
    let totalMembers = await Members.countDocuments()
    let totalPackages = await Package.countDocuments()
    let totalBookings = await Booking.countDocuments()
    res.send({
        success: true,
        status: 200,
        message: 'Welcome Admin',
        totalTrainers: totalTrainers,
        totalMembers: totalMembers,
        totalPackage: totalPackages,
        totalBooking: totalBookings,

    })

}
module.exports = { dashboard }