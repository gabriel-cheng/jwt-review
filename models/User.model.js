const mongoose = require("mongoose");

const User = mongoose.model("SistemaLogin", {
    userName: {type: String, require: true},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    userAdmin: {type: Boolean}
});

module.exports = User;