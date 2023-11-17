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