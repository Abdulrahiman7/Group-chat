const express=require('express');
const router=express.Router();
const ChatController=require('../controllers/chatControl');
const Authorization=require('../middleware/token');

router.post('/chatHome',Authorization.TokenAuthorization, ChatController.inputMessage);

router.get('/chatHome',Authorization.TokenAuthorization, ChatController.showMessages);

module.exports=router;