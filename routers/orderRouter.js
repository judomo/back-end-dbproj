const express = require('express');
const orderRouter = express.Router();

const { Order, Camp, User, OrderCamp } = require('../db.js')


orderRouter.route('/createOrder').post(function(req, res) {

    const {user_id, amount, camp_id, price} = req.body;

    Order.findAll({where: {UserUserId: user_id, isPaid:false}}).then(order => {

        console.log(order[0])

        if(order.length !== 0){

            OrderCamp.findAll({where: {CampCampId:camp_id, OrderOrderId: order[0].order_id}, raw: true}).then( ordercamp => {


                if(ordercamp.length !== 0){

                    let ordercamps_selector = {where: {CampCampId:camp_id, OrderOrderId: order[0].order_id}}

                    let new_amount = (parseInt(ordercamp[0].amount) + parseInt(req.body.amount))

                    let ordercamps_update =  { amount: new_amount }

                    let order_selector = {where: {order_id: order[0].order_id}}
                    let values_order_update = {sum_of_pay: order[0].sum_of_pay + (amount) * price}


                    Order.update(values_order_update, order_selector).then( order_updated => {

                        OrderCamp.update(ordercamps_update, ordercamps_selector).then(order_camp_updated => {

                            res.json(order_updated)

                        }).catch(err => console.log(err))

                    }).catch( err => console.log(err))

                }

                else {


                    Camp.findOne({where: {camp_id: camp_id}})

                        .then(camp => {

                            if (!camp) return;

                            order[0].addCamp(camp, {through: {amount: amount}}).then(ordercamp => {



                                let values_order_update = {sum_of_pay: order[0].sum_of_pay + (parseInt(amount)) * price}


                                order[0].update(values_order_update).then(order_new =>{

                                    res.json(order_new)


                                })

                            }).catch(err => console.log(err));

                        }).catch(err => console.log(err));


                }

            }).catch( err => console.log(err))

        }

        else {


            Order.create({
                sum_of_pay: amount * price,
                isPaid: false,
                UserUserId: user_id

            }).then(order => {


                Camp.findOne({where: {camp_id: camp_id}})

                    .then(camp => {

                        if (!camp) return;

                        order.addCamp(camp, {through: {amount: amount}}).then(ordercamp => {



                            order.update()

                            res.json(ordercamp)

                        });

                    }).catch(err => console.log(err));

            }).catch(err => console.log(err))


        }


    }).catch( err => res.json(err))

})

orderRouter.get('/getAll', (async (req, res) => {

    //


    Order.findAll({

        // Make sure to include the products
        include: [{
            model: Camp,
            required: false,
            // Pass in the Product attributes that you want to retrieve
            attributes: ['camp_id', 'name', 'price'],
            through: {
                // This block of code allows you to retrieve the properties of the join table
                model: OrderCamp,
                attributes: ['amount'],
            }
        }]
    }).then( allOrders => {

        res.json(allOrders)

    }).catch( err => console.log(err));

}));

orderRouter.get('/deleteOrder/:id', (async (req, res) => {

    Order.destroy({
        where: {
            order_id:req.params.id
        }
    }).then( () => {
        res.json('Order with ID ' + req.params.id + " was deleted successfully");
    }).catch(err => console.log(err))

}));

orderRouter.post('/deleteOrderLine/', (async (req, res) => {

    const {order_id, camp_id, price, sum_of_pay, amount} = req.body;


    let values =  { sum_of_pay: (parseInt(sum_of_pay) - (parseInt(price)*parseInt(amount)))}

    let selector = {
        where: { order_id:order_id }
    };

    Order.update(values, selector).then( () => {

        OrderCamp.destroy({
            where: {
                OrderOrderId:order_id, CampCampId:camp_id
            }

        }).then( () => {

            res.json('OrderCamp with OrderID ' + order_id + " and CampId " + camp_id + " was deleted successfully");

        }).catch(err => console.log(err))

    })


}));


orderRouter.route('/getOrder/:id').get(function(req, res) {

    Order.findOne({where: {order_id: req.params.id}})
        .then(order => {

            if(!order) res.json('Net takogo loh');

            order.getCamps().then(camps=>{
                for(camp of camps){
                    res.log("camp:", camp.name);
                }
            });
        });

})



module.exports = orderRouter;