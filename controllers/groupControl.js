
const Group=require('../models/group');
const UserGroup = require('../models/userGroup');
const Chat=require('../models/chat');
const User=require('../models/user');
const GroupAdmin=require('../models/groupAdmin');
const sequelize = require('../util/database');

exports.newGroup= async (req, res, next)=>{
    try{
        const t=await sequelize.transaction();
        console.log('entered the new group');
         const group=req.body.newGroup.group;
         const about=req.body.newGroup.about;
      
        
         const newGroup=await Group.create({'groupName':group, 'about':about},{transaction:t});
         const usergroupUpdate=await UserGroup.create({'groupId':newGroup.id, 'userId':req.user.id},{transaction:t});
         const adminroupUpdate=await GroupAdmin.create({'groupId':newGroup.id, 'userId':req.user.id},{transaction:t});
         await t.commit();
         res.status(200).json(null);
    }catch(err)
    {
        await t.rollback();
        console.log(err);
    }
    
}

exports.groupList=async (req, res, next)=>{
    const t=await sequelize.transaction();const userId=req.user.id;
        
    try{
        const groupList=await UserGroup.findAll({
            where:{'userId':userId},
            attributes:['groupId'],
            include:[
                {
                    model: Group,
                    attributes: ['groupName']
                }
            ]
        },{transaction:t});
        console.log();
        let allMessages=[]
        for(let i=0;i<groupList.length;i++)
        {
            const messages=await Chat.findAll({
                where:{'groupId':groupList[i].groupId},
                attributes:['id','message','createdAt'],
                include:[
                    {
                        model: User,
                        attributes: ['id','name']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: 10
            },{transaction:t});
            const admin=await GroupAdmin.findAll({
                where:{'groupId':groupList[i].groupId},
                attributes:['userId']
            },{transaction:t})
            const adminUserIds = admin.map(adminInstance => adminInstance.userId);
            allMessages.push({
                'groupId':groupList[i].groupId,
                'groupName':groupList[i].group.groupName,
                'message':messages,
                'lastChat_id': (messages && messages[0] && messages[0].id) || 0,
                'admin':adminUserIds
            })
        }
        t.commit();
        res.status(200).json({allMessages, 'user':req.user.id});
   }catch(err)
   {
    t.rollback();
       console.log(err);
   }
}

exports.deleteGroup= async (req, res, next) =>{
    try{
        const groupId=req.params.groupId;
        
        const deleteGrp = await Group.destroy({
            where: { id: groupId },
          });
          if(deleteGrp == 1) res.status(200).json(null);
          else res.status(404).json(null);
    }catch(err)
    {
        console.log(err);
    }
}

exports.searchUser= async (req, res, next) =>{
    try{
        const mobile=req.query.mobile;
        const groupId=req.query.groupId;
        const searchUser=await User.findAll({
            where:{ number: mobile},
        })
        if(searchUser.length >0) 
        {
            const newUser=await UserGroup.findAll({
                where:{
                    userId: searchUser[0].id,
                    groupId: groupId
                },
                required:false
            })
            if(newUser.length>0)    res.status(201).json(null);
            else res.status(200).json({newUser:searchUser[0]});
        }else   res.status(201).json(null);  
    }catch(err)
    {
        console.log(err);
    }
}

exports.addUser= async (req, res, next)=>{
    try
    {
        const groupId=req.query.groupId;
        const userId=req.query.userId;
   
        const addMember=await UserGroup.create({'groupId': groupId, 'userId':userId});
        res.status(200).json(null);
    }catch(err)
    {
        console.log(err);
    }
}

exports.exitUser=async (req, res, next)=>{
    try
    {
        
        const groupId=req.query.groupId;
        const userId=req.query.userId;
        const isAdmin=req.query.isAdmin;
        const deleteMember=await UserGroup.destroy({
            where:{
                'groupId': groupId,
                 'userId':userId
                }
            });
        if(deleteMember == 1) 
        {
            if(isAdmin === true)
            {
                const deleteAdmin=await GroupAdmin.destroy({
                    where:{
                        'groupId': groupId,
                         'userId':userId
                        }
                    }); 
            }
            
            res.status(200).json(null);
        }
        else throw new Error();
    }catch(err)
    {
      
        console.log(err);
    }
}

exports.manageUserList= async (req, res, next)=>{
    try
    {
        const groupId=req.query.groupId;
        const members=await UserGroup.findAll({
            attributes:['userId'],
            where:{
                groupId: groupId
                },
            include:[
                 {
                        model: User,
                        attributes: ['name','number']
                 }
                ]
            })
        res.status(200).json({members});
    }catch(err)
    {
        console.log(err);
    }
}

exports.addAdmin= async (req, res, next)=>{
    try
    {
        
        const groupId=req.query.groupId;
        const userId=req.query.userId;
   
        const newAdmin=await GroupAdmin.create({
                'groupId': groupId,
                 'userId':userId
            });
        res.status(200).json(null);
      
    }catch(err)
    {
        console.log(err);
    }
}