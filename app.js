const express= require('express');
const bodyParser=require('body-parser');
require('dotenv').config();
const sequelize=require('./util/database');
const cors=require('cors');
const app=express();


const UserRoute=require('./routers/userRoute');

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ['GET','POST']
}));
app.use(bodyParser.json());
app.use(UserRoute);

sequelize.sync()
.then(()=>{
 app.listen(4000);
})
.catch((err)=>{
    console.log(err);
})