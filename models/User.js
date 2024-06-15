import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please add First Name"],
        trim: true,
        maxlength: [50, "First Name can not be more than 50 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Please add Last Name"],
        trim: true,
        maxlength: [50, "Last Name can not be more than 50 characters"],
    },
    username: {
        type: String,
        required: [true, "Please add Username"],
        unique: true,
        trim: true,
        minlength: [6, "Username can not be less than 6 characters"],
        maxlength: [32, "Username can not be more than 32 characters"],
        match: [
            /^[a-zA-Z0-9]+$/,
            "Username can only contain letters(a-z A-Z) and numbers",
        ],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "Password can not be less than 6 characters"],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
