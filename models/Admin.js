const crypto = require('crypto')
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const joi = require("joi");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required : [true, 'Please provide your email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail , 'Please provide a valid email']
    },
    password: {
        type : String,
        required : [true, 'Please provide a valid password'],
        minlength : 8,
        select : false,
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please confirm your password'],
        validate : {
            validator : function (pass) {
                return pass === this.password
            },
            message : 'Password is not the same'
        },
    },
    profilePicture: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'super-admin'],
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpire : Date
});

// Instance Method belong to Model
adminSchema.pre('save', async function (next) {
    // it run if password is modified to hash it
    if(!this.isModified('password')) return next;

  // to hashing pass
    this.password = await bcrypt.hash(this.password, 10);

    // to delete password confirm field
    this.passwordConfirm = undefined;
    next()
})

// Update passwordChangedAt property for the user when change password
adminSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

adminSchema.methods.correctPassword = async(candedatePassword, userPassword)=> {
    return await bcrypt.compare(candedatePassword, userPassword);
}

// add method check if password changed
adminSchema.methods.changedPasswordAfter = (passwordChangedAt,JWTTiemstamp) => {
    if (passwordChangedAt) {
        const changedTimestamp = parseInt(passwordChangedAt.getTime() /1000, 10)
        return changedTimestamp > JWTTiemstamp;
    }
    return false;
}

// Document Methods belong to document
adminSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


// joi validation
// sign Up
let validateSignUpAdmin = (data) => {
  schema = joi.object({
    name: joi.string().required().min(5),
    email: joi.string().required().min(5).email(),
    // Minimum eight characters, at least one uppercase letter
    //one lowercase letter, one number and one special character
    password: joi
      .string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
        )
      )
      .required()
      .messages({
        "string.pattern.base": `Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
    passwordConfirm: joi.required().valid(data.password).messages({
      "any.only": "The two passwords do not match",
      "any.required": "Please re-enter the password",
    }),
    profilePicture: joi.string().required(),
    role: joi.string().required().valid("admin", "super-admin"),
  });
  return schema.validate(data, { abortEarly: false });
};
// sign in  validation admin
let validateSignInAdmin = (data) => {
  schema = joi.object({
    email: joi.string().required().min(5).email(),
    password: joi
      .string()
      .required()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
        )
      )
      .messages({
        "string.pattern.base": `Password minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
  });
  return schema.validate(data, { abortEarly: false });
};


const Admin = mongoose.model("Admin", adminSchema);
module.exports = { Admin, validateSignUpAdmin, validateSignInAdmin };