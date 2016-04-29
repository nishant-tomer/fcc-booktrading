var userController = require("./controllers/userController"),
    helpers = require("./controllers/helpers");


module.exports = function(app,passport){

    app.get("/profile",function(req, res) {
        res.render("profile.jade")
    });

    app.get("/",function(req,res){
      res.render("home.jade")
    })

    app.get("/signup",function(req,res){
      res.render("signup.jade", {"message":req.flash("message")})
    })

    app.get("/login",function(req,res){
      res.render("login.jade", {"message":req.flash("message")})
    })

    app.get("/logout",function(req,res){
      req.logout()
      res.redirect("/")
    })

    // app.get("/profile",helpers.isLoggedIn,userController.getProfile)
    app.post("/editprofile",helpers.isLoggedIn,helpers.validate,userController.editProfile)
    app.post("/signup",helpers.validate,userController.register)

    app.post("/login",helpers.validate,passport
                        .authenticate('local',{
                              successRedirect:"/profile",
                              failureRedirect:"/login",
                              failureFlash:"Invalid username or Password",
                              successFlash:"Welcome to your online books catalogue !"
                            })
    )


}
