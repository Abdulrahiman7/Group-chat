const express=require('express');
const router=express.Router();
const ChatController=require('../controllers/chatControl');
const Authorization=require('../middleware/token');

router.post('/chatHome',Authorization.TokenAuthorization,ChatController.inputMessage);



module.exports=router;