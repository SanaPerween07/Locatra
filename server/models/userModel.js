const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false 
    },
    googleId: {
      type: String,
      required: false
    },
    isGoogleUser: {
      type: Boolean,
      required: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
