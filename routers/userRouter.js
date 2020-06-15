
const express = require('express');
const userRouter = express.Router();
const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const passport = require('passport');


const { User } = require('../db.js')


// Load User model
const { ensureAuthenticated } = require('../config/auth');

userRouter.get('/userCheck', ensureAuthenticated, (req, res) => {

    res.json({
        user: req.user
    });

});


userRouter.get('/findUserInfo/:id', (req, res) => {

    let user_id = req.params.id; //accessing parameters from the URL

    User.findOne({where:{user_id: user_id},raw: true }).then( user=> {
        res.json(user);
    })

});



// Register
userRouter.post('/register', (req, res) => {

    console.log(req.body)

    const {email, first_name, last_name, phone_1, phone_2, phone_3, password } = req.body;

    let errors = [];

    if (!email || !password  || !first_name || !last_name || !phone_1) {
        res.send('Please enter all fields');
        errors.push(' ');
    }

    if (password.length < 8) {
        res.send('Password must be at least 8 characters');
        errors.push(' ');
    }

    if (errors.length > 0) {
        //res.send(errors)

    } else {

                User.findOne({where:{email: email},raw: true }).then(user => {

                    if (user) {

                        res.send('Email already exists');
                        errors.push('');

                    } else {



                        bcrypt.genSalt(10, (err, salt) => {

                            bcrypt.hash(password, salt, (err, hash) => {

                                if (err) throw err;

                                if(phone_1 && !phone_2 && !phone_3) {
                                    User.create({
                                        last_name: last_name,
                                        first_name: first_name,
                                        email: email,
                                        phone_1: phone_1,
                                        isAdmin: false,
                                        password: hash,
                                    }).then((user) => {

                                        res.json(user)

                                    }).catch(err => console.log(err));

                                }

                                else if (phone_1 && phone_2 && !phone_3){

                                    User.create({
                                        last_name: last_name,
                                        first_name: first_name,
                                        email: email,
                                        phone_1: phone_1,
                                        phone_2: phone_2,
                                        isAdmin: false,
                                        password: password,
                                    }).then((user) => {

                                        res.json(user)

                                    }).catch(err => console.log(err));

                                }
                                else {

                                    User.create({
                                        last_name: last_name,
                                        first_name: first_name,
                                        email: email,
                                        phone_1: phone_1,
                                        phone_2: phone_2,
                                        phone_3: phone_3,
                                        isAdmin: false,
                                        password: password,
                                    }).then((user) => {

                                        res.json(user)

                                    }).catch(err => console.log(err));
                                }
                                });
                        });
                    }
                });
    }
});



userRouter.post('/userUpdate/', (req, res) => {


    const {email, first_name, last_name, phone_1, phone_2, phone_3, password } = req.body;

    let errors = [];

    if (!email || !password  || !first_name || !last_name || !phone_1) {
        res.send('Please enter all fields');
        errors.push(' ');
    }

    if (password.length < 8) {
        res.send('Password must be at least 8 characters');
        errors.push(' ');
    }

    if (errors.length > 0) {
        //res.send(errors)

    } else {


        User.findOne({where:{email: email} }).then(user => {

            bcrypt.genSalt(10, (err, salt) => {

                bcrypt.hash(password, salt, (err, hash) => {

                    if (err) throw err;

                    if(phone_1 && !phone_2 && !phone_3) {

                        user.update({
                            last_name: last_name,
                            first_name: first_name,
                            email: email,
                            phone_1: phone_1,
                            password: hash,
                        }).then((user) => {

                            res.json(user)

                        }).catch(err => console.log(err));

                    }

                    else if (phone_1 && phone_2 && !phone_3){

                        user.update({
                            last_name: last_name,
                            first_name: first_name,
                            email: email,
                            phone_1: phone_1,
                            phone_2: phone_2,
                            password: hash,
                        }).then((user) => {

                            res.json(user)

                        }).catch(err => console.log(err));

                    }
                    else {

                        user.update({
                            last_name: last_name,
                            first_name: first_name,
                            email: email,
                            phone_1: phone_1,
                            phone_2: phone_2,
                            phone_3: phone_3,
                            password: hash,
                        }).then((user) => {

                            res.json(user)

                        }).catch(err => console.log(err));
                    }
                });
            });



        });
    }
});

// Login
// userRouter.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//
//
//         successRedirect: '/api/users/successjson',
//         failureRedirect: '/api/users/failurejson',
//     },)(req, res, next);
// });

userRouter.post('/login', passport.authenticate('local' , { failureRedirect: '/api/users/failurejson'}),
    function(req, res) {
        console.log(req.user);
        req.session.user = req.user;
        res.redirect('/api/users/successjson');
    }
);

userRouter.get('/successjson', function(req, res) {
    res.send('success')
});

userRouter.get('/failurejson', function(req, res) {
    res.send('Invalid email or password');
});

// Logout
userRouter.get('/logout',  (req, res) => {
    console.log('logout')
    req.logout();
    if (req.session) {

        // delete session object
        req.session.destroy(error => {

            req.session = null;
            if (error) return next(error);

            res.send({ logout: true })
        });
    }
});


module.exports = userRouter;
