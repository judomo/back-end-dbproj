const to = require('await-to-js').default;

const LocalStrategy = require('passport-local').Strategy;

const User = require('../../../models/users/user/User');

const { UserError } = require('../../../errors-types/index');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    });

    passport.use(
        'user-login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true, // allows us to pass back the entire request to the callback
            },
            async function(req, email, password, next) {
                let err, user;
                /* Find any user with such email */
                [err, user] = await to(
                    User.findOne({
                        email: email,
                    }),
                );
                if (err) next(err);
                /* If any user was not found with input email */
                if (!user)
                    return next(
                        new UserError.NOT_FOUND(
                            {
                                msg: 'Не існує такого користувача з введеним e-mail.',
                            },
                            null,
                        ),
                    );

                /* If user entered not valid password to such email */
                if (!user.isUserValidPwd(password, user.password))
                    return next(
                        new UserError.NOT_FOUND(
                            {
                                msg: 'Було введено неправильний пароль',
                            },
                            null,
                        ),
                    );

                /* Save userID and isUserAuthorized values in session */
                req.session.userID = user._id;
                req.session.isUserAuthorized = true;
                return next(null, user);
            },
        ),
    );
};
