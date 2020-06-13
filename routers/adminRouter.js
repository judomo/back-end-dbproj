const express = require('express');
const adminRouter = express.Router();

const { Admin } = require('../db.js')

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

module.exports = adminRouter;