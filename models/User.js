import mongoose from "mongoose";

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim:true
    },
    lastName: {
      type: String,
      trim:true
    },
    email: {
      type: String,
      required: true,
      trim:true
    },
    accounttype: {
      type: String,
      required:true,
      enum: ['Customer', 'Hotel Manager', 'Admin'],
      default: 'Customer',
      trim:true
    },
    password: {
      type: String,
      required: true,
      trim:true
    }
  });

  //Model
  const UserModel = mongoose.model("user", userSchema);

  export default UserModel
