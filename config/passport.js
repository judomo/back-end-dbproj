const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const { User } = require('../db.js')

module.exports = function(passport) {

  passport.use(

    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {


      // Match user
      User.findOne({where:{email:email}, raw:true}).then(user => {

        if (!user) {
          console.log('user not found')

          return done(null, false, { message: 'That email is not registered' });

        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {

            // console.log(user)

            return done(null, user);

          } else {

            return done(null, false, { message: 'Password incorrect' });

          }

        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    console.log("Serialize")
    done(null, user.user_id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("Deserialize")
    User.findOne({where:{user_id:id}, raw: true}).then( user => {

        done(null, user);

    })

  });
};
