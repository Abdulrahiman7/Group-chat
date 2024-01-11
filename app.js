const express= require('express');
const bodyParser=require('body-parser');
require('dotenv').config();
const sequelize=require('./util/database');
const cors=require('cors');
const fileUpload=require('express-fileupload');
const path=require('path');

const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());


const UserRoute=require('./routers/userRoute');
const ChatRoute=require('./routers/chatRoute');
const GroupRoute=require('./routers/groupRoute');
require('./services/cronJob.js');
app.use(cors({
	origin: "http://15.206.79.217",
    methods: ['GET','POST','DELETE']
}));
app.use(bodyParser.json());
app.use(UserRoute);
app.use(ChatRoute);
app.use(GroupRoute);
app.use((req,res)=>{
	    console.log(req.url);
	    const [url, queryParams] = req.url.split('?');
	    res.sendFile(path.join(__dirname, `views/${url}`));
});

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

const websocket=require('./services/websocket');
const socketServer=5000;

sequelize.sync()
.then(()=>{
    const io=websocket(socketServer);
 app.listen(4000);
})
.catch((err)=>{
    console.log(err);
})
