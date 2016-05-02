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
    app.get("/books", helpers.isLoggedIn, booksController.getAll)
    app.post("/add", helpers.isLoggedIn, booksController.add )
    app.post("/remove", helpers.isLoggedIn, booksController.remove )
    app.post( "/borrow", helpers.isLoggedIn, booksController.borrow)
    app.post( "/accept", helpers.isLoggedIn, booksController.acceptrequest)
    app.post("/return", helpers.isLoggedIn, booksController.return)
    app.post("/revert", helpers.isLoggedIn, booksController.revert)
    app.post("/takeback", helpers.isLoggedIn, booksController.takeback)

}
