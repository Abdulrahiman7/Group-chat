
const Group=require('../models/group');
const UserGroup = require('../models/userGroup');
const Chat=require('../models/chat');
const User=require('../models/user');

exports.newGroup= async (req, res, next)=>{
    try{
       
        console.log('entered the new group');
         const group=req.body.newGroup.group;
         const about=req.body.newGroup.about;
      
        
         const newGroup=await Group.create({'groupName':group, 'about':about, 'admin':req.user.id});
         const usergroupUpdate=await UserGroup.create({'groupId':newGroup.id, 'userId':req.user.id});
         res.status(200).json(null);
    }catch(err)
    {
        console.log(err);
    }
    
}

exports.groupList=async (req, res, next)=>{
    try{
        const userId=req.user.id;
        const groupList=await UserGroup.findAll({
            where:{'userId':userId},
            attributes:['groupId'],
            include:[
                {
                    model: Group,
                    attributes: ['groupName','admin']
                }
            ]
        });
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
            });
            
            allMessages.push({
                'groupId':groupList[i].groupId,
                'groupName':groupList[i].group.groupName,
                'message':messages,
                'lastChat_id': (messages && messages[0] && messages[0].id) || 0,
                'admin':groupList[i].group.admin
                
            })
        }
        
        res.status(200).json({allMessages, 'user':req.user.id});
   }catch(err)
   {
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
        const searchUser=await User.findAll({
            where:{ number: mobile}
        })
        if(searchUser.length >0) res.status(200).json({newUser:searchUser[0]});
        else res.status(201).json(null);
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