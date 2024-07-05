const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Review must belong to a course!']
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Review must belong to a student!']
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


reviewSchema.pre('find', function (next) {
    this.populate({
        path: 'student',
        select: 'name'
    })
    next();
});

reviewSchema.statics.calcAverageRatings = async function (courseId){
    const stats = await this.aggregate([
        {
            $match : {course : courseId}
        },
        {
            $group : {
                _id : '$course',
                nRating : {$sum : 1},
                avgRating : {$avg : '$rating'}
            }
        }
    ]);

    await mongoose.model('Course').findByIdAndUpdate(courseId, {
        ratingsQuantity : stats[0].nRating,
        ratingsAverage : stats[0].avgRating
    })
};

reviewSchema.post('save', function (){
    this.constructor.calcAverageRatings(this.course)
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;