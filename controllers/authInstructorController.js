const catchAsync = require("../utils/catchAsync");
const Instructor = require("../models/Instructor");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}
const createSendToken = (instructor, statusCode, res) => {
    const token = signToken(instructor._id);

    res.setHeader('Authorization', `Bearer ${token}`);

    instructor.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data : {
            instructor
        }
    });
}

exports.signup = catchAsync (async(req, res) => {

    // Check if employee already exist
    const {email} = req.body;

    let freshInstructor = await Instructor.findOne({ email : email });
    if (freshInstructor) {
        return res.status(400).json({
            message : 'This Email is already Exist'
        })
    }

    const newInstructor = await Instructor.create(req.body);
    newInstructor.password = undefined;

    if (!newInstructor) return res.status(400).send('Error on create Employee!');

    res.status(201).json({
        status : 'successful',
        data : newInstructor
    });
})

exports.login = catchAsync (async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).send('Please provide email and password!');

    const instructor = await Instructor.findOne({email}).select('password');

    if (!instructor)
        return res.status(401).send('incorrect email, Please enter correct email!');

    if (!(await instructor.correctPassword( password, instructor.password )))
        return res.status(401).send('incorrect password, Please enter correct password!');

    createSendToken(instructor, 201, res)
})

exports.protect = catchAsync(async(req, res, next) => {
    // 1) getting token and check if token exist
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).send('Unauthorized, You are not logged in');
    }

    // 2) verification token so decoded show payload data
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(500).send(error.message)
    }

    // 3) we have to check if user still exist
    const freshUser = await Instructor.findById(decoded.id);
    if (!freshUser)
        return res.status(400).send('Instructor logging does no longer exist');

    // 4) check if user change password after the token was issued
    if(freshUser.changedPasswordAfter(freshUser.passwordChangedAt, decoded.iat))
        return res.status(401).send('Instructor resently changed password! Please login again.');

    req.instructor = freshUser;
    next();
})