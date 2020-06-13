
const Sequelize = require('sequelize')

const UserModel = require('./models/User')
const AdminModel = require('./models/Administrator')
const CampModel = require('./models/Camp')
const OrderModel = require('./models/Order')

const sequelize = new Sequelize('db_project', 'root', null, {
    host: '34.89.144.213',
    dialect: 'mysql',
    timestamp:false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const User =  UserModel(sequelize, Sequelize)
const Admin = AdminModel(sequelize, Sequelize)
const Camp = CampModel(sequelize, Sequelize)
const Order = OrderModel(sequelize, Sequelize)

const OrderCamp = sequelize.define('OrderCamp', {amount: Sequelize.INTEGER}, { timestamps: false })

Order.belongsToMany(Camp,
    { through: OrderCamp, unique: false })

Camp.belongsToMany(Order, { through: OrderCamp, unique: false })
Admin.hasMany(Camp, { onDelete: 'no action' })
User.hasMany(Order)



sequelize.sync()
    .then(() => {
        // console.log(`Database & tables created!`)
    })


module.exports = {
    User,
    Admin,
    Camp,
    Order,
    OrderCamp
}

