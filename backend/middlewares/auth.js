const jwt = require('jsonwebtoken') ;
require('dotenv').config() ;


exports.protect = (req,res,next)=>{
    try {
        const token = req.cookies.token  ; 
        // console.log("hey toen here ::" , token);
        if(!token){
            return res.status(401).json({
                success:false , 
                message:"unauthorized"
            })
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET) ;
        // console.log(decode);
        req.user = decode ;
        next() ;

    } catch (error) {
        return res.status(401).json({
            success:false , 
            message:error.message ,
        })

    }



}