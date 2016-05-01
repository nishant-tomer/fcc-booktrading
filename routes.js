var userController = require("./controllers/userController"),
    booksController = require("./controllers/booksController"),
    helpers = require("./controllers/helpers");


module.exports = function(app,passport){

//  General Routes
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


// User Manipulation Routes
    app.get("/profile", helpers.isLoggedIn, userController.getProfile)
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


// Catalog Manipulation routes
    app.get("/remove/:item", isLoggedIn, booksController.remove )
    app.get( "/borrow/:item", isLoggedIn, booksController.borrow)
    app.get("/return/:item", isLoggedIn, booksController.return)
    app.get( "/accept/:item", isLoggedIn, booksController.accept)
    app.get("/revert/:item", isLoggedIn, booksController.revert)
    app.get("/takeback/:item", isLoggedIn, booksController.takeback)


}
