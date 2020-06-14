const express = require('express');
const passport = require('passport');

const { check, body, validationResult } = require('express-validator/check');

const app = express();

const { UserError } = require('../../../errors-types/index');

app.post(
    '/',
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
            .withMessage("Пароль є обов'язковим.")
            .isLength({
                min: 6,
            })
            .withMessage('Пароль повинен бути не менше 6 символів.')
            .custom((password, { req }) => {
                if (password !== req.body.passwordRepeat)
                    throw new Error('Введені паролі не співпадають.');
                // Indicates the success of this synchronous custom validator
                return true;
            })
            .withMessage('Введені паролі не співпадають.'),
        body('passwordRepeat')
            .not()
            .isEmpty()
            .withMessage("Поле з повторним введенням паролю є обов'язким.")
            .custom((passwordRepeat, { req }) => {
                if (passwordRepeat !== req.body.password)
                    throw new Error('Введені паролі не співпадають.');
                // Indicates the success of this synchronous custom validator
                return true;
            })
            .withMessage('Введені паролі не співпадають.'),
    ],
    async function(req, res, next) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new UserError.VALIDATION(errors, null));
        } else {
            passport.authenticate(
                'user-registration',
                {
                    session: true,
                },
                async (err, isMailSent) => {
                    if (err) next(err);
                    else {
                        if (isMailSent) {
                            res.status(200).send({
                                isSuccess: true,
                            });
                        }
                    }
                },
            )(req, res, next);
        }
    },
);

module.exports = app;
