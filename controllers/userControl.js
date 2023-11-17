const User=require('../models/user');
const sequelize=require('../util/database');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function generateToken(id)
{

        const token=jwt.sign({userId:id}, process.env.jwt_secret_key);
        return token;
}

exports.newUser=async (req, res, next)=>{
    try{
        console.log('entered the backend');
        const t=await sequelize.transaction();

        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const number=req.body.number;
        

        const find=await User.findAll({where: {'email':email}},{transaction:t});
        if(find.length>0)
        {
            
            res.status(400).json(null);
        }else{
            bcrypt.hash(password,10, async (err, hash)=>{
                if(err)
                {
                    console.log('error in hashing the password');
                    res.status(400).json(null);
                }else{
                  
                    const user=await User.create({name:name, email:email, number:number, password:hash},{transaction:t});
                    await t.commit();
                    res.status(200).json(null);
                }
            });
        }

    }catch(err)
    {
        console.error(err);
    }

}

exports.login= async (req, res, next)=>{
    try{
        const findUser=await User.findAll({where:{email:req.body.email}});
    if(findUser.length>0)
    {
        const foundUser=findUser[0].get({plain: true});
       const loginCredentials=await bcrypt.compare(req.body.password, foundUser.password);
       if(loginCredentials)
       {
        const token=await generateToken(foundUser.id);
        res.status(200).json({token})
       }else res.status(401).json(null);
    }else res.status(404).json(null);
    }catch(err)
    {
      
        res.status(400).json({msg:err});
    }
    }
    