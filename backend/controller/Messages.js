/* 
    getUsersForSidebar
    getMessage
    sendMessage
*/

const Messages = require('../models/Message');
const UserSchema = require('../models/User');

exports.getUsersForSidebar = async (req, res) => {
    try {
        // console.log(req.user);
        const id = req.user.id ;
        // console.log(id);
        const allUsers = await UserSchema.find({ _id: { $ne: id } }).select('username email _id __v imgUrl');
        return res.status(200).json({
            success:true , 
            data: allUsers
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false , 
            message: error.message});
    }
}

exports.getMessage = async (req, res) => {
    try {
        const reciverId= req.params.id ;
        const  senderId = req.user.id ;
        // console.log("sender ", senderId);
        // console.log("reciver " , reciverId);
        const allMessages = await Messages.find( {
            $or:[{senderId:senderId , reciverId:reciverId} , 
                {senderId:reciverId , reciverId:senderId} ]});

        return res.status(200).json({
            success:true , 
            data: allMessages
        });
    } catch (error) {
        return res.status(500).json({
            success:false , 
            message:error.message , 
        })
    }
}
exports.sendMessage = async (req, res) => {
    try {
        const reciverId = req.params.id ; 
        const senderId = req.user.id ; 
        const {text} = req.body ;
        // console.log(text); 

        const newMessage = new Messages({
            senderId:senderId , 
            reciverId:reciverId , 
            text:text , 
        });
        const savedMessage = await newMessage.save() ;

        return res.status(200).json({
            success:true , 
            data: savedMessage , 
        });


        
    } catch (error) {
        return res.status(500).json({
            success:false , 
            message:error.message , 
        }
    )}


}