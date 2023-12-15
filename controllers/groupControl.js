
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
                    attributes: ['groupName']
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
                'lastChat_id': (messages && messages[0] && messages[0].id) || 0
                
            })
        }
        
        res.status(200).json({allMessages, 'user':req.user.id});
   }catch(err)
   {
       console.log(err);
   }
}

