const express=require('express');
const UserController=require('../controllers/userControl');
const router=express.Router();

router.post('/signup',UserController.newUser);

router.post('/login',UserController.login);
module.exports=router;