const express=require('express');
const UserController=require('../controllers/userControl');
const router=express.Router();

router.post('/signup',UserController.newUser);


module.exports=router;