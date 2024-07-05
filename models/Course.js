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

courseSchema.pre('find', function (next) {
    this.populate({
        path : 'instructor',
        select : 'name'
    }).populate({
        path : 'category',
        select : 'name'
    })
    next();
})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;