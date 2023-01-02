const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, minLength: "3", maxLength: "50", required: true },
    email: { type: String, minLength: "3", maxLength: "100", unique: true, required: true },
    password: { type: String, minLength: "6", required: true },
})

module.exports = mongoose.model("User", userSchema);