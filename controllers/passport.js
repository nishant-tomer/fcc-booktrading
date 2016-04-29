var User = require("../models/user")
var Strategy = require("passport-local").Strategy


module.exports = function (passport){

  passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  passport.use(new Strategy(
    function(username, password, done) {
      User.findOne({name:username}, function(err, user) {

        if (err) { return done(err) }

        if (!user) { return done(null, false)}

        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err) }
            if ( !isMatch ) {
              return done(null, false);
            }
            return done(null, user)
        })
      })
    })
  )

}
