const catchAsync = require("../utils/catchAsync");
const Student = require("../models/Student");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require("../utils/email");

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

    // Check if student already exist
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

exports.forgotPassword = catchAsync(async(req, res) => {
    // 1) Get user from email
    const user = await Student.findOne({email : req.body.email})
    if (!user) {
        return res.status(404).send('There is no user with email address!.');
    }
    // 2) Generate the random reset Token
    const resetToken = user.createPasswordResetToken();

    await user.save({validateBeforeSave : false});

    // Send it to User's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/student/reset-password/${resetToken}`;

    const message = `Forget your password? Submit a PATCH request with your new password
    and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, Please ignore
    this email!`;

    const subject = 'Your password reset token (valid to 10 min)';

    try {
        await sendEmail(user.email, subject, message);

        res.status(200).json({
            status : 'success',
            message : 'Token sent to email!'
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({validateBeforeSave : false});

        return res.status(500).send('There is an error sending the email. Try again later!')
    }
})

exports.resetPassword = catchAsync( async(req, res) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await Student.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpire : {$gt : Date.now()}
    })

    // 2) If token has not expired, and there is user, set the new password
    if (!user)return res.status(400).send('Token is invalid or has expired!');

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    // 3) Update passwordChangedAt property for the user
    // 4) Log the user in, send token
    createSendToken(user, 201, res);
})

exports.updatePassword = catchAsync( async(req, res) => {
    const user = await Student.findById(req.student._id).select('password');

    // Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return res.status(401).send('Your current password is wrong!');
    }

    // If so, update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    // Log user in, send JWT
    createSendToken(user, 200, res)
})