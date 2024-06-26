const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


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
    }
});

adminSchema.pre('save', async function (next) {
    // it run if password is modified to hash it
    if(!this.isModified('password')) return next;

    // to hashing pass
    this.password = await bcrypt.hash( this.password , 10);

    // to delete password confirm field
    this.passwordConfirm = undefined;
    next()
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

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;