module.exports = (sequelize, type) => {
    return sequelize.define('Order', {
        order_id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        payment_date: {
            type: type.DATE,
            allowNull: true,

        },
        sum_of_pay: {
            type: type.INTEGER,
            allowNull: false
        },
        isPaid: {
            type: type.BOOLEAN,
            allowNull: false
        },
    })
}