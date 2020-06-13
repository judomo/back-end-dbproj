module.exports = (sequelize, type) => {
    return sequelize.define('User', {
        user_id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        last_name: {
            type: type.STRING,
            allowNull: false
        },
        first_name: {
            type: type.STRING,
            allowNull: false
        },
        email: {
            type: type.STRING,
            allowNull: false
        },
        phone_1: {
            type: type.STRING,
            allowNull: false
        },
        phone_2: {
            type: type.STRING,
            allowNull: true
        },
        phone_3: {
            type: type.STRING,
            allowNull: true
        },
        isAdmin:{
            type: type.BOOLEAN,
            allowNull: false,
            default: false
        },
        password:{
            type: type.STRING,
            allowNull: false
        }
    })
}