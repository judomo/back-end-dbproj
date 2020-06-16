const express = require('express');
const adminRouter = express.Router();

const { Admin, Camp } = require('../db.js')

adminRouter.route('/createAdmin').post(function(req, res) {


    const {last_name, first_name, email, phone} = req.body;

    Admin.create({
        last_name: last_name,
        first_name: first_name,
        email: email,
        phone: phone,

    }).then((user) => {

        res.json(user)

    }).catch(err => console.log(err));


});

adminRouter.route('/updateAdmin/:id').post(function(req, res) {


    const {last_name, first_name, email, phone} = req.body;

    let values =  {
        last_name: last_name,
        first_name: first_name,
        email: email,
        phone: phone,
    }

    let selector = {
        where: { admin_id: req.params.id }
    };

    Admin.update(values, selector)

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

adminRouter.route('/getAllAdmins').get(function( req, res, err) {

    Admin.findAll({raw: true}).then( admins =>{

        res.json(admins);
        res.status(200);


    }).catch( err=> console.log(err));
});

adminRouter.route('/getExactAdmin/:id/').get(function( req, res, err) {


    Admin.findOne({

        where: {admin_id: req.params.id},
        raw: true

    }).then(admin => {

            res.json(admin)

        }).catch(err => console.log(err));
})


adminRouter.route('/deleteAdmin/:id/').get(function( req, res, err) {

    Camp.findAll({where: {AdministratorAdminId: req.params.id}}).then( camps => {

        if(camps.length !== 0){

            let response = {

                msg: "Can't delete because Admin Profile in use",
                deleteStatus : false

            }

            res.json(response);

        }

        else {

            Admin.destroy({
                where: {
                    admin_id:req.params.id
                }
            }).then( () => {

                let response = {

                    msg: 'Camp with ID ' + req.params.id + " was deleted successfully",
                    deleteStatus : true

                }

                res.json(response);

            }).catch(err)

        }


    })



});

module.exports = adminRouter;