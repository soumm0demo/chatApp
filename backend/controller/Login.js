const UserSchema = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.LogIn = async (req, res) => {
    try {
        const { email, password ,  } = req.body;
        
        const user = await UserSchema.findOne({ email: email });
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Invalid credential " 
            })
        }

        const isPasswordmatch = await bcrypt.compare(password, user.password);
        if (!isPasswordmatch)
            return res.status(500).json({
                success: false,
                message: " Password not match ",
            })
        // log in token
        // console.log("hi1");
        user.password = undefined;
        const id = user?.id
        console.log(id);
        const token = jwt.sign({ id }, process.env.JWT_SECRET,{
            expiresIn:'7d'
        })
        // console.log(token);

        res.cookie("token", token, {
            httpOnly: false,
            sameSite: "Strict",  
            expires: new Date(Date.now() + 1 * 24*60 *60*1000 ) // Fixed: Using `expires`
        })
            .status(200)
            .json({
                token: token,
                user: user,
                success: true,
            });



    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "->" + err,
        })
    }




}

exports.LogOut = async (req, res) => {
    try {
        res.cookie("token","").status(200).json({
            success:true,
            message:"Log Out SuccessFully .. . ."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }




}
exports.getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserSchema.findById(id);
        user.password = undefined;
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}