const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Subscription must belong to a student!']
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Subscription must belong to a course!']
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
