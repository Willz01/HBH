require("dotenv").config();

const mongoose = require('mongoose')
const validate = require('validator')
const bcrypt = require('bcrypt')

const getRand = function (max) {
    return Math.floor(Math.random() * max);
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        validate: [validate['isEmail'], "Invalid Email"],  // valid & authentic emails
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dp: {
        type: String,
        required: false,
        default: process.env.PROFILE_PHOTO_BASE + `${getRand(600)}.png`
    }
})

userSchema.index({email: 1}, {unique: true})
userSchema.index({name: 1}, {unique: true})

// password hash and salt gen
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// password validation // on login
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema)

