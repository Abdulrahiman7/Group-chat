const express=require('express');
const router=express.Router();
const GroupController=require('../controllers/groupControl');
const Authorization=require('../middleware/token');

router.post('/createGroup',Authorization.TokenAuthorization, GroupController.newGroup);

router.get('/groupList',Authorization.TokenAuthorization, GroupController.groupList);



module.exports=router;