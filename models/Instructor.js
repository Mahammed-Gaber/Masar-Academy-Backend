const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const instructorSchema = new mongoose.Schema({
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
    bio: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    // experience: {
    //     type: Number,
    // },
    specialties: [{
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

instructorSchema.pre('save', async function (next) {
    // it run if password is modified to hash it
    if(!this.isModified('password')) return next;

    // to hashing pass
    this.password = await bcrypt.hash( this.password , 10);

    // to delete password confirm field
    this.passwordConfirm = undefined;
    next()
})

instructorSchema.methods.correctPassword = async(candedatePassword, userPassword)=> {
    return await bcrypt.compare(candedatePassword, userPassword);
}

// add method check if password changed
instructorSchema.methods.changedPasswordAfter = (passwordChangedAt,JWTTiemstamp) => {
    if (passwordChangedAt) {
        const changedTimestamp = parseInt(passwordChangedAt.getTime() /1000, 10)
        return changedTimestamp > JWTTiemstamp;
    }
    return false;
}

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
