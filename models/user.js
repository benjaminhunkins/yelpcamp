const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

//add PLM's useful methods to user model
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);