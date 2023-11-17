const jwt=require('jsonwebtoken');
const User=require('../models/user');

exports.TokenAuthorization=async (req, res, next)=>{
    try{
   
        const token= req.headers.authorization;
        const key=process.env.jwt_secret_key;
       
    const auth=jwt.verify(token, key);
    
    User.findByPk(auth.userId)
    .then((user)=>{
        req.user=user;
        next();
    });
    }catch(err)
    {
        res.status(400).json({msg:err});
    }
}