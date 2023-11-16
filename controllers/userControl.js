const User=require('../models/user');
const sequelize=require('../util/database');
const bcrypt=require('bcrypt');

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