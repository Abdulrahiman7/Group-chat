const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const chat=sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=chat;