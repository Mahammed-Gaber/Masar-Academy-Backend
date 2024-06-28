const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required : true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    ratingsAverage : {
        type : Number,
        default : 0
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps : true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;