const express = require('express');
const campRouter = express.Router();

const { Camp, Admin, OrderCamp, Order } = require('../db.js')


campRouter.route('/getAllCamps').get(function( req, res, err) {

    Camp.findAll({attributes: ['camp_id','name','place_name', 'description', 'price', 'place_type', 'oblast', 'district', 'street', 'building_number', ], raw: true}).then( camps =>{

            res.json(camps);
            res.status(200);


    }).catch( err=> console.log(err));
});

campRouter.route('/getExactCamp/:id/').get(function( req, res, err) {



    Camp.findOne({

        where: {camp_id: req.params.id},
        raw: true,
        attributes: ['name','place_name', 'food_and_place', 'description', 'price', 'place_type', 'oblast', 'district', 'street', 'building_number','AdministratorAdminId']

    }).then(camp => {

        Admin.findOne({where: {admin_id: camp.AdministratorAdminId}}).then(admin => {


            let adminCamp = {
                admin_id:req.params.id,
                name: camp.name,
                place_name: camp.place_name,
                food_and_place: camp.food_and_place,
                description: camp.description,
                price: camp.price,
                place_type: camp.place_type,
                oblast: camp.oblast,
                district: camp.district,
                street: camp.street,
                building_number: camp.building_number,
                AdministratorAdminId: camp.AdministratorAdminId,
                admin_first_name: admin.first_name,
                admin_last_name: admin.last_name,
            }

            res.json(adminCamp)

        }).catch(err => console.log(err));
    })
});

campRouter.route('/createCamp').post(function(req, res) {


    const {name, description, food_and_place, place_type, place_name, oblast, district, street, building_number, AdministratorAdminId, price} = req.body;

    Camp.create({
        name: name,
        description: description,
        food_and_place: food_and_place,
        place_type: place_type,
        place_name: place_name,
        oblast: oblast,
        district: district,
        street: street,
        building_number: building_number,
        AdministratorAdminId: AdministratorAdminId,
        price: price,

    }).then((camp) => {

        res.json(camp)

    }).catch(err => console.log(err));


});


campRouter.route('/updateCamp/:id').post(function(req, res) {


    const {name, description, food_and_place, place_type, place_name, oblast, district, street, building_number, AdministratorAdminId, price} = req.body;

    let values =  { name: name ,
        description: description,
        food_and_place: food_and_place,
        place_type: place_type,
        place_name: place_name,
        oblast: oblast,
        district: district,
        street: street,
        building_number: building_number,
        AdministratorAdminId: AdministratorAdminId,
        price: price }


    Camp.findOne({where: {camp_id: req.params.id}}).then(camp => {

        let camp_price = camp.price

        OrderCamp.findAll({where: {CampCampId: req.params.id}}).then(ordercamps => {

            if (ordercamps.length !== 0) {

                ordercamps.forEach(ordercamp => {


                    Order.findOne({where: {order_id: ordercamp.OrderOrderId}}).then(order => {


                        order.update({sum_of_pay: (order.sum_of_pay - (camp_price * ordercamp.amount)) + parseInt(values.price) * (ordercamp.amount)})


                    })


                })

                camp.update(values)

                res.json('Camp with ID ' + req.params.id + " was updated successfully");



            } else {

                camp.update(values)

                res.json('Camp with ID ' + req.params.id + " was updated successfully");

            }

        })
    })
        .catch(err =>
            {
                console.log(err);
            }
        )


});

campRouter.route('/deleteCamp/:id/').get(function( req, res, err) {

    Camp.findOne({where: {camp_id: req.params.id}}). then( camp => {

        let camp_price = camp.price

        OrderCamp.findAll({where: {CampCampId: req.params.id}}).then(ordercamps => {

            if (ordercamps.length !== 0) {

                ordercamps.forEach(ordercamp => {


                    Order.findOne({where: {order_id: ordercamp.OrderOrderId}}).then(order => {


                        order.update({sum_of_pay: (order.sum_of_pay - (camp_price * ordercamp.amount))})

                    })

                })
            }

        }).then( () => {
            camp.destroy().then( () => {

                res.json('Camp with ID ' + req.params.id + " was deleted successfully");

            }).catch(err)
        })
    })

});


module.exports = campRouter;