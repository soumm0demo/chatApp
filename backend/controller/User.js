const UserSchema = require('../models/User');
const cloudinary = require('cloudinary');

exports.updateUser = async (req, res) => {

    try {
        const { username, email } = req.body;
        const id = req.user.id;
        // console.log(id);
        const img = req.files?.file;
        let imgUrl;
        const uniqueUser = await UserSchema.findOne({ username: username });
        // const uniqueEmail = await UserSchema.findOne({ email: email });

        if (uniqueUser) {
            console.log(`${uniqueUser ? "UserName" : "Email"} Already Exists ...`,);
            return res.status(404).json({
                success: false,
                message: `${uniqueUser ? "UserName" : "Email"} Already Exists ...`,
            })
        }

        if (img) {
            try {
                const Url = await cloudinary.uploader.upload(img.tempFilePath, { folder: 'Chatty' })
                imgUrl = Url.secure_url;

            } catch (error) {
                console.log("Error in cloudinary Upload : ", error);
            }
        }
        // console.log("image Url ", imgUrl);
        let updatedUser;
        if (imgUrl) {
            updatedUser = await UserSchema.findByIdAndUpdate(id, { username, email, imgUrl }, { new: true, })
        }
        else {
            updatedUser = await UserSchema.findByIdAndUpdate(id, { username, email }, { new: true, })
        }
        updatedUser.password = undefined;
        return res.status(200).json({
            success: true,
            user: updatedUser,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }




}