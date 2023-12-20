const { Console } = require('console');
const Chat=require('../models/chat');
const { Op } = require('sequelize');
const User=require('../models/user');



exports.inputMessage=async (req, res, next)=>{
    try{
       
        const message=req.body.message;
        if(!message)
        {
            res.status(404).json(null);
        }
        const groupId=req.body.groupId;
        
        const newChat=await req.user.createChat({message, 'groupId':groupId});
        res.status(200).json({newChat,'user':req.user.id});
    }catch(err)
    {
        res.status(400).json({msg:err});
        console.log(err);
    }
}


exports.showMessages= async (req, res, next) =>{
    try{
       const {prevId, groupId}=req.query;
            const messages = await Chat.findAll({
                where: {
                  groupId: groupId,
                  id: {
                    [Op.gt]: prevId,
                  },
                },
                order: [['createdAt', 'DESC']],
                include:[
                    {
                        model: User,
                        attributes: ['id','name']
                    }
                ]
              });
              
            if(messages.length==0)
            {
                res.status(201).json(null);
            }else res.status(200).json({messages});
            
        
    }catch(err)
    {
        console.log(err);
        res.status(400).json({err:err})
    }
}