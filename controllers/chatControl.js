const Chat=require('../models/chat');
exports.inputMessage=async (req, res, next)=>{
    try{
       
        const message=req.body.message;
        if(!message)
        {
            res.status(404).json(null);
        }
        
        const newChat=await req.user.createChat({message});
        res.status(200).json({newChat});
    }catch(err)
    {
        res.status(400).json({msg:err});
        console.log(err);
    }
}

exports.showMessages= async (req, res, next) =>{
    try{
       
        const chats=await Chat.findAll({attributes: ['message']});
     
        res.status(200).json({chats});
    }catch(err)
    {
        res.status(400).json({err:err})
    }
}