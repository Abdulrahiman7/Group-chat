
const Sequelize=require('sequelize');
const sequelize=new Sequelize(process.env.db_name, process.env.db_user, process.env.db_password,{
    dialect: 'mysql',
    host: process.env.DB_HOST,
    logging: false,
});
module.exports=sequelize;
