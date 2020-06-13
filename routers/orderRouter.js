const express = require('express');
const orderRouter = express.Router();

const { Order, Camp, User, OrderCamp } = require('../db.js')


orderRouter.route('/createOrder').post(function(req, res) {

    const {user_id, amount, camp_id} = req.body;

    if(!user_id || !camp_id || amount){

        res.json("Enter all fields")

    }

    else {

        OrderCamp.findAll(
            {where: {
            camp_id: camp_id
            }, raw:true}).then( ordercamps => {

                console.log(ordercamps)

                Order.findAll({where:{order_id:ordercamps.OrderOrderId, user_id:req.body.user_id}, raw:true}).then( order =>{


                    if(order) {

                        let order_camp_update =  { amount: ordercamps.amount + req.body.amount }

                        ordercamps.update(ordercampupdate).then( ordercampsnew => {

                            order.update()

                            res.json(ordernew + ordercamps);

                        }).catch( err => console.log(err))

                    }

                    else {

                        Order.create({
                            sum_of_pay: 0,
                            isPaid: false,
                            UserUserId : user_id

                        }).then(order => {

                            console.log(order)


                            Camp.findOne({where: {camp_id: camp_id}})

                                .then(camp => {

                                    if (!camp) return;

                                    order.addCamp(camp, {through: {amount: 2}}).then( ordercamp => {


                                        res.json(ordercamp)

                                    });

                                }).catch(err => console.log(err));

                        }).catch(err => console.log(err))


                    }


                }).catch(err=> console.log(err))

        }).catch(err=> console.log(err))



    }

})



module.exports = orderRouter;