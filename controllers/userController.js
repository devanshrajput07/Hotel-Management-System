import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from "../config/emailConfig.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import express from 'express'

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

class UserController {
    static userRegistration = async (req, res) => {
        const { firstName, lastName, email, accounttype, password } = req.body
        const user = await UserModel.findOne({ email: email })
        if (user) {
            res.render(path.join(__dirname, "views/login.ejs"), { user: req.user });
        } else {
            if (firstName && lastName && email && accounttype && password) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new UserModel({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        accounttype: accounttype,
                        password: hashPassword,
                    })
                    await doc.save()
                    const saved_user = await UserModel.findOne({ email: req.body.email })
                    if (saved_user) {
                        res.render(path.join(__dirname, "views/login.ejs"), { user: req.user });
                    } else {
                        res.render(path.join(__dirname, "views/Hotel.ejs"));
                        alert("Signup again")
                    }
                } catch (error) {
                    console.log(error)
                    res.send({ "status": "failed", "message": "Unable to Register" })
                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }
        }
    }

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatch) {
                        // Generate JWT Token
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.send({ "status": "success", "message": "Login Success", "token": token })
                    } else {
                        res.send({ "status": "failed", "message": "Email or Password is not Valid" })
                    }
                } else {
                    res.send({ "status": "failed", "message": "You are not a Registered User" })
                }
            } else {
                res.send({ "status": "failed", "message": "All Fields are Required" })
            }
        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Unable to Login" })
        }
    }

    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body;
        if (email) {
            try {
                const user = await UserModel.findOne({ email: email });
                if (user) {
                    const secret = user._id.toString() + process.env.JWT_SECRET_KEY;
                    const token = jwt.sign({ userID: user._id.toString(), type: 'reset' }, secret, { expiresIn: '15m' });
                    const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
                    console.log(link);

                    // Send Email
                    let info = await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: "Hotel - Password Reset Link",
                        html: `<a href=${link}>Click Here</a> to Reset Your Password`,
                    });

                    res.send({ status: "success", message: "Password Reset Email Sent... Please Check Your Email" });
                } else {
                    res.send({ status: "failed", message: "Email doesn't exist" });
                }
            } catch (error) {
                console.log(error);
                res.send({ status: "failed", message: "Error occurred while sending the email" });
            }
        } else {
            res.send({ status: "failed", message: "Email Field is Required" });
        }
    };

    static userPasswordReset = async (req, res) => {
        const { password } = req.body;
        const { token } = req.params;
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ status: "failed", message: "User not found" });
            }
            const new_secret = user._id.toString() + process.env.JWT_SECRET_KEY;
            const savedToken = user.resetToken; // Updated the field to resetToken
            if (!savedToken || token !== savedToken) {
                return res.status(400).json({ status: "failed", message: "Invalid or expired token" });
            }
            jwt.verify(token, new_secret);
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(password, salt);
                user.password = newHashPassword;
                user.resetToken = resetToken; // Updated the field to resetToken
                await user.save();
                res.send({ status: "success", message: "Password Reset Successfully" });
            } else {
                res.status(400).json({ status: "failed", message: "All Fields are Required" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "failed", message: error.message });
        }
    };

    static deleteUser = async (req, res) => {
        const { email } = req.body;
        try {
            const requestingUser = await UserModel.findOne({ email: req.user.email });
            if (requestingUser.accounttype !== 'Admin') {
                return res.status(403).json({ message: 'Access denied. Only Admins can delete users.' });
            }
            const deletedUser = await UserModel.findOneAndDelete({ email: email });
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully', deletedUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

export default UserController