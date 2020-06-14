const express = require('express');
const passport = require('passport');

const { check, validationResult } = require('express-validator/check');

const app = express();

const { UserError } = require('../../../errors-types/index');

const ensureAuthenticated = require('../../../controllers/utils-user/authorization/index');

app.post(
    '/check',
    [
        check('email')
            .not()
            .isEmpty()
            .withMessage('Вкажіть вашу пошту!')
            .isEmail()
            .withMessage('Невалідне оформлення пошти!'),
        check('password')
            .not()
            .isEmpty()
            .withMessage("Поле пароль є обов'язковим!"),
    ],
    async function(req, res, next) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new UserError.VALIDATION(errors, null));
        } else {
            passport.authenticate(
                'user-login',
                {
                    session: true,
                },
                function(err) {
                    if (err) next(err);
                    else if (req.session.isUserAuthorized)
                        res.status(200).send({
                            isSuccess: true,
                            userID: req.session.userID,
                        });
                },
            )(req, res, next);
        }
    },
);

app.get('/check/session', ensureAuthenticated, async function(req, res) {
    return res.status(200).send({
        userID: req.session.userID,
        isSuccess: req.session.isUserAuthorized,
    });
});

module.exports = app;
