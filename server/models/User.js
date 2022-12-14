var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        unique: [true, "Email already exists in database"],
        lowercase: true,
        trim: true,
        required: [true, "Email not provided"],
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "{VALUE} is not a valid email",
        },
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        sparse: true,
    },
    resetPasswordToken: {
        type: String,
        sparse: true,
    },
    resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
