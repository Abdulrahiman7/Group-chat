const { Console } = require('console');
const Chat=require('../models/chat');
const { Op } = require('sequelize');

var lastRecordedId=0;

exports.inputMessage=async (req, res, next)=>{
    try{
       
        const message=req.body.message;
        if(!message)
        {
            res.status(404).json(null);
        }
        
        const newChat=await req.user.createChat({message});
        lastRecordedId=newChat.id;
        console.log(lastRecordedId);
        res.status(200).json({newChat});
    }catch(err)
    {
        res.status(400).json({msg:err});
        console.log(err);
    }
}


exports.showMessages= async (req, res, next) =>{
    try{
       console.log('entered');
       console.log(lastRecordedId);
       console.log(req.query.prevId);
        if(req.query.prevId==0 || lastRecordedId != req.query.prevId)
        {
            const chats=await Chat.findAll({
                limit:10, 
                order:[['createdAt', 'DESC']]
            });
            lastRecordedId=req.query.prevId;
            res.status(200).json({chats});
        }else res.status(201).json(null);
        
    }catch(err)
    {
        console.log(err);
        res.status(400).json({err:err})
    }
}