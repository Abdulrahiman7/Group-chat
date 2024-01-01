const express= require('express');
const bodyParser=require('body-parser');
require('dotenv').config();
const sequelize=require('./util/database');
const cors=require('cors');
const app=express();


const UserRoute=require('./routers/userRoute');
const ChatRoute=require('./routers/chatRoute');
const GroupRoute=require('./routers/groupRoute');

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ['GET','POST','DELETE']
}));
app.use(bodyParser.json());
app.use(UserRoute);
app.use(ChatRoute);
app.use(GroupRoute);

const User=require('./models/user');
const Chat=require('./models/chat');
const Group=require('./models/group');
const UserGroup = require('./models/userGroup');
const GroupAdmin=require('./models/groupAdmin');

Chat.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});
User.hasMany(Chat);
Chat.belongsTo(Group,{constraints: true, onDelete: 'CASCADE'});
Group.hasMany(Chat,{constraints: true, onDelete: 'CASCADE'});
User.belongsToMany(Group,{ through: UserGroup})
Group.belongsToMany(User, {through: UserGroup});
UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);
User.belongsToMany(Group,{ through: GroupAdmin})
Group.belongsToMany(User, {through: GroupAdmin});
GroupAdmin.belongsTo(User);
GroupAdmin.belongsTo(Group);

sequelize.sync()
.then(()=>{
 app.listen(4000);
})
.catch((err)=>{
    console.log(err);
})