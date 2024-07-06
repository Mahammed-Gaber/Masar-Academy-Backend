const Review = require("../models/Review");
const catchAsync = require("../utils/catchAsync");


exports.getAllReview = catchAsync(async(req, res) => {
    const reviews = await Review.find();

    res.status(200).json({
        status : 'success',
        results : reviews.length,
        reviews : reviews
    })
})

exports.getReviewsForCourse = catchAsync(async(req, res) => {

    const reviews = await Review.find({ course : req.params._id});
    if (!reviews || reviews.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No reviews found'
        });
    }

    res.status(200).json({
        status : 'success',
        results : reviews.length,
        reviews : reviews
    })
})

exports.createReview = catchAsync(async(req, res)=> {

    const newReview = await Review.create({...req.body, course : req.params.id, student : req.student._id});
    if (!newReview) {
        return res.status(400).send('faild add new review');
    }

    const reviews = await Review.find({ course : req.body.course});

    res.status(201).json({
        status : 'success',
        review : reviews
    })
})

exports.updateReview = catchAsync(async(req, res)=>{

    const updateOne = await Review.findOneAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });

    res.status(200).json({
        updates : 'success',
        data : updateOne
    })
})