const UserSchema = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('cloudinary')

exports.SignIn = async (req, res) => {
    try {
        const { username, email, password } =  req.body ; 
        const imgFile = req.files.file;
        const resultUrl = await cloudinary.uploader.upload(imgFile.tempFilePath, {
            folder: 'Chatty',
        })
        const imageUrl = resultUrl.secure_url ; 
        try {
            const uniqueUser = await UserSchema.findOne({ username: username });
            const uniqueEmail = await UserSchema.findOne({ email: email });

            if (uniqueUser || uniqueEmail) {
                return res.status(400).json({
                    success: false,
                    message: `${uniqueUser ? "UserName" : "Email"} Already Exists ...`,
                })
            } else {
                let hashedPassword;
                try {
                    hashedPassword = await bcrypt.hash(password, 10);

                } catch (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Server error while hashing password " + err.message,
                    })
                }
                const newUser = await UserSchema.create({
                    username,
                    email,
                    password: hashedPassword,
                    imgUrl : imageUrl , 
                })

                return res.status(200).json({
                    success: true,
                    // token:token , 
                    message: "Entry Created Successfully .. ",
                    data: newUser,
                })
            }


        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "->" + error.message
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "final err " + error.message,
        })
    }




}