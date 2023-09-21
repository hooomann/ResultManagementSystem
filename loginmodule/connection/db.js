const Sequelize  =require('sequelize');


const sequelize = new Sequelize('bookstore','admin','12345678',{
    host:'database-1.cfv4eqrdw98w.eu-north-1.rds.amazonaws.com',
    dialect:'mysql'
})
module.exports = sequelize