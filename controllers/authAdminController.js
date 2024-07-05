const crypto = require('crypto');
const catchAsync = require("../utils/catchAsync");
const Admin = require("../models/Admin");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require("../utils/email");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}
const createSendToken = (admin, statusCode, res) => {
    const token = signToken(admin._id);

    res.setHeader('Authorization', `Bearer ${token}`);

    admin.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data : {
            admin
        }
    });
}

exports.signup = catchAsync (async(req, res) => {

    // Check if Admin already exist
    const {email} = req.body;

    let freshAdmin = await Admin.findOne({ email : email });
    if (freshAdmin) {
        return res.status(400).json({
            message : 'This Email is already Exist'
        })
    }

    const newAdmin = await Admin.create(req.body);
    newAdmin.password = undefined;

    if (!newAdmin) return res.status(400).send('Error on create Employee!');

    res.status(201).json({
        status : 'successful',
        data : newAdmin
    });
})

exports.login = catchAsync (async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).send('Please provide email and password!');

    const admin = await Admin.findOne({email}).select('password');

    if (!admin)
        return res.status(401).send('incorrect email, Please enter correct email!');

    if (!(await admin.correctPassword( password, admin.password )))
        return res.status(401).send('incorrect password, Please enter correct password!');

    createSendToken(admin, 201, res)
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
    const freshUser = await Admin.findById(decoded.id);
    if (!freshUser)
        return res.status(400).send('Admin logging does no longer exist');

    // 4) check if user change password after the token was issued
    if(freshUser.changedPasswordAfter(freshUser.passwordChangedAt, decoded.iat))
        return res.status(401).send('Admin resently changed password! Please login again.');

    req.admin = freshUser;
    next();
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).send('You do not have permission to perform this action!')
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async(req, res, next) => {
    // 1) Get user from email
    const user = await Admin.findOne({email : req.body.email})
    if (!user) {
        return res.status(404).send('There is no user with email address!.');
    }
    // 2) Generate the random reset Token
    const resetToken = user.createPasswordResetToken();

    await user.save({validateBeforeSave : false});

    // Send it to User's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/admin/reset-password/${resetToken}`;

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

    const user = await Admin.findOne({
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
    const user = await Admin.findById(req.admin._id).select('password');

    // Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return res.status(401).send('Your current password is wrong!');
    }

    // If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in, send JWT
    createSendToken(user, 200, res)
})