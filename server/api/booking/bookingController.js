const Booking = require('./bookingModel')
const Package = require('../package/packageModel')
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();



const bookPackage = async (req, res) => {
    let validation = ''
    if (!req.body.packageId)
        validation += ' packageId is required '
    if (!req.body.customerId)
        validation += ' customerId is required '
    if (!req.body.bookingDate)
        validation += ' bookingDate is required '

    if (!!validation) {
        return res.send({ success: false, status: 403, message: "validation Error:" + validation })
    }
    else {
        await Booking.findOne({ customerId: req.body.customerId, bookingDate: req.body.bookingDate, packageId: req.body.packageId }).then((bookingData) => {
            if (bookingData) {
                res.send({
                    success: false, status: 400, message: "Could not book the same package at the same time"
                })
            }
            else {
                const newBooking = new Booking()
                newBooking.packageId = req.body.packageId
                newBooking.customerId = req.body.customerId
                newBooking.bookingDate = req.body.bookingDate



                newBooking.save().then((result) => {
                    res.send({
                        success: true,
                        status: 200,
                        message: "Booked Successfully",
                        data: result
                    })
                }).catch((err) => {
                    res.send({
                        success: true,
                        status: 200,
                        message: err.message

                    })
                })
            }

        }).catch((err) => {
            res.send({
                success: true,
                status: 200,
                message: err.message

            })
        })
    }
}



const pay = async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({
        success: false,
        message: "_id is required"
      });
    }

    const bookingData = await Booking.findById(req.body._id);
    if (!bookingData) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const packageData = await Package.findById(bookingData.packageId);
    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: packageData.name,
            },
            unit_amount: Number(packageData.price) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/mybookings",
    });

    bookingData.paymentType = 1;
    bookingData.stripeSessionId = session.id;

    await bookingData.save();

    return res.status(200).json({
      success: true,
      sessionId: session.id
    });

  } catch (error) {
    console.error("Stripe Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    console.log("SessionId from frontend:", sessionId);

    const booking = await Booking.findOne({
      stripeSessionId: sessionId
    });

    console.log("Booking found:", booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.paymentStatus = 2;
    await booking.save();

    console.log("Payment updated successfully");

    res.json({ success: true });

  } catch (err) {
    console.log("Confirm error:", err);
    res.status(500).json({ success: false });
  }
};
const changeStatus = (req, res) => {

    let validation = ''
    if (!req.body._id)
        validation += '_id is require'
    if (!req.body.status)
        validation += 'status is required'
    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        Booking.findOne({ _id: req.body._id })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'No Booking found' })
                else {
                    if (!!req.body.status)
                        result.status = req.body.status
                    result.save()
                        .then(updatedResult => {
                            res.send({ success: true, status: 200, message: "Status Changed Successfully", data: updatedResult })
                        })
                        .catch(error => {
                            res.send({ success: false, status: 500, message: error.message })
                        })
                }
            })
            .catch(error => {
                res.send({ success: false, status: 500, message: error.message })
            })

    }
}

const single = (req, res) => {
    let validation = ""
    if (!req.body._id) {
        validation = "_id is required"
    }
    if (!!validation) {
        res.send({ success: false, status: 500, message: validation })
    }
    else {
        Booking.findOne({ _id: req.body._id })
            .then((data) => {
                if (data == null) {
                    res.send({ success: false, status: 500, message: "Booking Does not exist" })
                }
                else
                    res.send({ success: true, status: 200, message: "Booking Loaded", data: data })
            })
            .catch((err) => {
                res.send({ success: false, status: 500, message: err.message })
            })
    }
}

const all = (req, res) => {
    Booking.find(req.body).sort({ createdAt: -1 })
        .populate('packageId').populate('customerId')
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "Loaded Successfully",
                data: data,
                total: data.length
            })
        })
        .catch((err) => {
            res.send({
                success: false,
                status: 500,
                message: err.message
            })
        })
}









module.exports = { bookPackage, all, single, changeStatus, pay ,confirmPayment }
