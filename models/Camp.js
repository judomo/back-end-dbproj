module.exports = (sequelize, type) => {
    return sequelize.define('Camp', {
        camp_id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        food_and_place: {
            type: type.TEXT,
            allowNull: false
        },
        description: {
            type: type.TEXT,
            allowNull: false
        },
        place_type: {
            type: type.INTEGER,
            allowNull: false
        },
        place_name: {
            type: type.STRING,
            allowNull: false
        },
        oblast: {
            type: type.STRING,
            allowNull: false
        },
        district: {
            type: type.STRING,
            allowNull: true
        },
        street: {
            type: type.STRING,
            allowNull: false
        },
        building_number: {
            type: type.STRING,
            allowNull: false
        },
        price: {
            type: type.INTEGER,
            allowNull: false
        }
    })
}