const catchAsync = require("../utils/catchAsync");
const Student = require("../models/Student");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}
const createSendToken = (student, statusCode, res) => {
    const token = signToken(student._id);

    res.setHeader('Authorization', `Bearer ${token}`);

    student.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data : {
            student
        }
    });
}

exports.signup = catchAsync (async(req, res) => {

    // Check if employee already exist
    const {email} = req.body;

    let freshStudent = await Student.findOne({ email : email });
    if (freshStudent) {
        return res.status(400).json({
            message : 'This Email is already Exist'
        })
    }

    const newStudent = await Student.create(req.body);
    newStudent.password = undefined;

    if (!newStudent) return res.status(400).send('Error on create Employee!');

    res.status(201).json({
        status : 'successful',
        data : newStudent
    });
})

exports.login = catchAsync (async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).send('Please provide email and password!');

    const student = await Student.findOne({email}).select('password');

    if (!student)
        return res.status(401).send('incorrect email, Please enter correct email!');

    if (!(await student.correctPassword( password, student.password )))
        return res.status(401).send('incorrect password, Please enter correct password!');

    createSendToken(student, 201, res)
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
    const freshUser = await Student.findById(decoded.id);
    if (!freshUser)
        return res.status(400).send('Admin logging does no longer exist');

    // 4) check if user change password after the token was issued
    if(freshUser.changedPasswordAfter(freshUser.passwordChangedAt, decoded.iat))
        return res.status(401).send('Admin resently changed password! Please login again.');

    req.student = freshUser;
    next();
})