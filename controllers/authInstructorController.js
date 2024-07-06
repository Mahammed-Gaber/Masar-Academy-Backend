const catchAsync = require("../utils/catchAsync");
const Instructor = require("../models/Instructor");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require("../utils/email");

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

    // Check if instructor already exist
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

exports.forgotPassword = catchAsync(async(req, res) => {
    // 1) Get user from email
    const user = await Instructor.findOne({email : req.body.email})
    if (!user) {
        return res.status(404).send('There is no user with email address!.');
    }
    // 2) Generate the random reset Token
    const resetToken = user.createPasswordResetToken();

    await user.save({validateBeforeSave : false});

    // Send it to User's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/instructor/reset-password/${resetToken}`;

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

    const user = await Instructor.findOne({
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
    const user = await Instructor.findById(req.instructor._id).select('password');

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