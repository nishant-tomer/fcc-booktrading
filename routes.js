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
      console.log( req.flash("message") )
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
    app.get("/add/:item", helpers.isLoggedIn, booksController.add )
    app.get("/remove/:item", helpers.isLoggedIn, booksController.remove )
    app.get( "/borrow/:item", helpers.isLoggedIn, booksController.borrow)
    app.get( "/accept/:item", helpers.isLoggedIn, booksController.accept)
    app.get("/return/:item", helpers.isLoggedIn, booksController.return)
    app.get("/revert/:item", helpers.isLoggedIn, booksController.revert)
    app.get("/takeback/:item", helpers.isLoggedIn, booksController.takeback)


}
