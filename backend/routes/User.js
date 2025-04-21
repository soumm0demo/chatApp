const express = require('express') ; 
const router = express.Router() ;


const {SignIn} = require('../controller/SignIn') ; 
const {LogIn,LogOut , getUser} = require('../controller/Login') ; 
const {protect} = require('../middlewares/auth') ;
const {updateUser} = require('../controller/User') ; 

//Sign In handler 
router.post("/signin" , SignIn) ; 
router.post("/login" ,  LogIn) ; 
router.get("/logout" , protect, LogOut)
router.get("/user/:id", protect ,  getUser)
router.post('/updateuser', protect ,updateUser )



module.exports = router ; 