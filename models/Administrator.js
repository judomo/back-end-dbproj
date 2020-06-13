module.exports = (sequelize, type) => {
    return sequelize.define('Administrator', {
        admin_id: {
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
        phone: {
            type: type.STRING,
            allowNull: false
        },
    })
}