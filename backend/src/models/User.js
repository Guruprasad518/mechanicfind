const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: { type: String, unique: true },
  password: String,
  type: { type: String, default: "user" }
});

module.exports = mongoose.model("User", UserSchema);
