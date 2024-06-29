const catchAsync = require("../utils/catchAsync");
const {
  Admin,
  validateSignUpAdmin,
  validateSignInAdmin,
} = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);

  res.setHeader("Authorization", `Bearer ${token}`);

  admin.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      admin,
    },
  });
};

/**
 * @desc     signup
 * @route   /api/admin/signup
 * @method   post
 */

exports.signup = catchAsync(async (req, res) => {
  //check validation data by Joi
  let { error } = validateSignUpAdmin(req.body);
  if (error) {
    return res.status(404).send(error.message);
  }
  // Check if employee already exist
  const { email } = req.body;
  let freshAdmin = await Admin.findOne({ email: email });
  if (freshAdmin) {
    return res.status(400).json({
      message: "This Email is already Exist",
    });
  }

  const newAdmin = await Admin.create(req.body);
  newAdmin.password = undefined;

  if (!newAdmin) return res.status(400).send("Error on create Employee!");

  res.status(201).json({
    status: "successful",
    data: newAdmin,
  });
});

/**
 * @desc     login
 * @route   /api/admin/login
 * @method   post
 */
exports.login = catchAsync(async (req, res) => {
  //check validation data by Joi
  let { error } = validateSignInAdmin(req.body);
  if (error) {
    return res.status(404).send(error.message);
  }
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Please provide email and password!");

  const admin = await Admin.findOne({ email }).select("password");

  if (!admin)
    return res.status(401).send("incorrect email, Please enter correct email!");

  if (!(await admin.correctPassword(password, admin.password)))
    return res
      .status(401)
      .send("incorrect password, Please enter correct password!");

  createSendToken(admin, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send("Unauthorized, You are not logged in");
  }

  // 2) verification token so decoded show payload data
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(500).send(error.message);
  }

  // 3) we have to check if user still exist
  const freshUser = await Admin.findById(decoded.id);
  if (!freshUser)
    return res.status(400).send("Admin logging does no longer exist");

  // 4) check if user change password after the token was issued
  if (freshUser.changedPasswordAfter(freshUser.passwordChangedAt, decoded.iat))
    return res
      .status(401)
      .send("Admin resently changed password! Please login again.");

  req.admin = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res
        .status(403)
        .send("You do not have permission to perform this action!");
    }
    next();
  };
};
