Sequelize=require('sequelize');
const sequelize=require('../util/database');

const archievedChat=sequelize.define('archieved-chat',{
	    id:{
		            type:Sequelize.INTEGER,
		            primaryKey: true,
		            autoIncrement: true,
		            allowNull: false
		        },
	    message:{
		            type:Sequelize.STRING,
		            allowNull:false
		        },
	    fileUrl:{
		            type:Sequelize.STRING,
		            allowNull:true,
		        }
});

module.exports=archievedChat;
