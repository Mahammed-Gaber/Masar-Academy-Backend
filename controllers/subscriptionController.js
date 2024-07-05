const catchAsync = require("../utils/catchAsync");
const Subscription = require("../models/Subscription");
const sendEmail = require("../utils/email");


exports.createSubscription = catchAsync( async(req, res) => {

    const newSubscription = await Subscription.create({ student : req.student._id, course : req.params._id });

    if(!newSubscription) return res.sendStatus(400);

    // await sendEmail(newSubscription)
    res.status(201).json({
        status: 'success',
        newSubscription,
        message : 'We will contact you soon'
    })
})

// Find all pending subscription requests
exports.getAllPendingSubscriptionRequest = catchAsync( async(req, res) => {
    const pendingRequests = await Subscription.find({paymentStatus : 'pending'});

    if (!pendingRequests || pendingRequests.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No Pending requests found!'
        });
    }

    res.status(200).json({
        status: 'success',
        pendingRequests
    });
})

// Confirm Subscription
exports.confirmSubscription = catchAsync( async(req, res) => {

    const updateSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true,
    });

    if (!updateSubscription) {
        return res.status(404).json({
            status: 'fail',
            message: 'Subscription not found'
        });
    }
    res.status(201).json({
        status : 'success',
        data : updateSubscription
    });
})

// find all Subscriptions belongs to student
exports.getAllSubscriptionsForStudent = catchAsync(async(req, res) => {

    const allSubscriptions = await Subscription.find({ student: req.student._id });

    if (! allSubscriptions|| allSubscriptions.length === 0) {
        return res.status(200).json({
            status: 'success',
            message: 'No Subscriptions found yet!'
        });
    }

    res.status(200).json({
        status : 'success',
        results: allSubscriptions.length,
        subscriptions : allSubscriptions
    })
})