const express = require('express');
const router = express.Router();


const { getUsersForSidebar, getMessage, sendMessage } = require('../controller/Messages')


const { protect } = require('../middlewares/auth');

router.get('/allusers',protect ,   getUsersForSidebar);
router.get('/message/:id', protect, getMessage);
router.post('/sendmessage/:id', protect , sendMessage);




module.exports = router;


