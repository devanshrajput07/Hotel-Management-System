import mongoose from "mongoose";

//Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  accounttype: {
    type: String,
    enum: ['Customer', 'Hotel-Manager', 'Admin'],
    default: 'Customer',
  },
  password: {
    type: String,
    required: true,
  },
  resetToken : {
    type: String
  }
});

//Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel
