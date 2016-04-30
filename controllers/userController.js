var User = require("../models/user")

var userController = module.exports = {}


userController.register = function(req,res){

      var newUser = new User();
      newUser.username = req.body.username
      newUser.city = req.body.city
      newUser.state = req.body.state
      newUser.password = req.body.password

      newUser.save( function(err, data){
              if (err){ console.log(err) }
              req.login( data, function(){
                req.flash("message","Welcome to your Brand New Profile!")
                res.redirect("/profile")
               });

             } )


}

userController.getProfile = function(req,res){
  User.findOne({_id:req.user._id}, function(err, user){
        if(err){ console.log(err); return;}
        if( req.flash("message") == undefined ) { req.flash("message","Welcome!") }
        res.render("profile.jade", { "msg":req.flash("message"), "user":user })
  })
}

userController.editProfile = function(req,res){

  User.findOne({_id:req.user._id}, function(err, user){

        if(err){ console.log(err); return;}
        user.comparePassword(req.body.oldpassword, function(err, isMatch) {
            if (err) { console.log(err); return  }

            if ( !isMatch ) {
              req.flash("message","Invalid Password")
              res.redirect("/profile")
            }

            user.username = req.body.newusername.length != 0 ? req.body.newusername : user.username
            user.city = req.body.newcity.length != 0 ? req.body.newcity : user.city
            user.state = req.body.newstate.length != 0 ? req.body.newstate : user.state
            user.password = req.body.newpassword.length != 0 ? req.body.newpassword : user.password

            user.save( function(err, data){
                      if (err){ console.log(err) }
                      req.flash("message","Profile Edited Succesfully.")
                      res.redirect("/profile")
                    })

        })
  })
}
