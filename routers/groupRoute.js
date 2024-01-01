const express=require('express');
const router=express.Router();
const GroupController=require('../controllers/groupControl');
const Authorization=require('../middleware/token');

router.post('/createGroup',Authorization.TokenAuthorization, GroupController.newGroup);

router.get('/groupList',Authorization.TokenAuthorization, GroupController.groupList);

router.delete('/deleteGroup/:groupId',Authorization.TokenAuthorization, GroupController.deleteGroup);

router.get('/searchUser',Authorization.TokenAuthorization, GroupController.searchUser);

router.get('/addUser',Authorization.TokenAuthorization, GroupController.addUser);

router.delete('/exitGroup',Authorization.TokenAuthorization, GroupController.exitUser);

router.get('/manageGroup', Authorization.TokenAuthorization, GroupController.manageUserList);

router.get('/addAdmin',Authorization.TokenAuthorization, GroupController.addAdmin);
module.exports=router;