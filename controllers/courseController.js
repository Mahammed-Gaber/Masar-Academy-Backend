const Course = require("../models/Course");
const catchAsync = require("../utils/catchAsync");


// Create Course
exports.createCourse = catchAsync( async(req, res) => {
    const {title, description, category, price} = req.body;
    const newCourse = await Course.create({title, description, instructor : req.instructor._id, category, price});
    if (!newCourse) return res.sendStatus(400);

    res.status(200).json({
        status : 'success',
        course : newCourse
    })
});

// Get All Courses
exports.getAllCourses =catchAsync( async(req, res) => {
    const allCourses = await Course.find();

    if (!allCourses || allCourses.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No Courses found'
        });
    }

    res.status(200).json({
        status : 'success',
        results: allCourses.length,
        courses : allCourses
    })
});

// find all courses belongs to an instructor
exports.getAllCoursesForInstructor = catchAsync( async(req, res) => {
    if (!req.params.id) return res.status(404).send('Id course not found');

    const allCourses = await Course.find({ instructor: req.params._id });

    if (!allCourses || allCourses.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No cources were found for this instructor'
        });
    }

    res.status(200).json({
        status : 'success',
        results: allCourses.length,
        allCourses
    })
});

// Get all courses belongs to a category
exports.getAllCoursesByCategory = catchAsync ( async(req, res)=> {
    const allCourses = await Course.find({ category : req.params._id });

    if (!allCourses || allCourses.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No courses were found for this category'
        });
    }

    res.status(200).json({
        status : 'success',
        results: allCourses.length,
        allCourses
    })
})

// Show top rated courses
exports.getTopRatedCourses = catchAsync( async(req,res) => {

    const topRatedCourses = await Course.find({
            ratingsAverage: { $gte: 3.5 }
        })
        .sort({ ratingsAverage: -1 })
        .limit(6)
        .lean();

    if (!topRatedCourses || topRatedCourses.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'There are no courses with a higher rating yet!'
        });
    }

    res.status(200).json({
        status: 'success',
        data: topRatedCourses
    });
})

exports.updateCourse = catchAsync( async(req, res) => {

    if (!req.params.id) return res.status(404).send('Id course not found');

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true,
    });

    if (!updatedCourse) {
        return res.status(404).json({
            status: 'fail',
            message: 'Course not found'
        });
    }
    res.status(201).json({
        status : 'success',
        data : updatedCourse
    });
});

exports.removeCourse = catchAsync( async(req, res) => {
    if (!req.params.id) return res.status(404).send('Id course not found');
    
    const deleteCourse = await Course.findByIdAndDelete(req.params.id)

    if (!deleteCourse) {
        return res.status(404).json({
            status: 'fail',
            message: 'course not found'
        });
    }

    res.sendStatus(204);
});