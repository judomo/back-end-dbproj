const express = require('express');
const campRouter = express.Router();

const { Camp, Admin } = require('../db.js')


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

    let selector = {
        where: { camp_id: req.params.id }
    };

    Camp.update(values, selector)
        .then(() =>{

            res.json('Camp with ID ' + req.params.id + " was updated successfully");

        })
        .catch(err =>
            {
                console.log(err);
                res.json(err);
            }
        )



});

campRouter.route('/deleteCamp/:id/').get(function( req, res, err) {

    Camp.destroy({
        where: {
            camp_id:req.params.id
        }
    }).then( () => {
        res.json('Camp with ID ' + req.params.id + " was deleted successfully");
    }).catch(err)

});


module.exports = campRouter;