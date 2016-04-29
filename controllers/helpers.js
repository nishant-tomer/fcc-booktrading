var helpers = module.exports = {}

helpers.isLoggedIn = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash("message", "You need to Login First")
        res.redirect('/login')
}

helpers.validate = function(req,res,next){

    var patternNameAndAddress = /[a-z A-Z]+/
    var patternPassword = /[a-z A-Z0-9]{6,}/

    if (req.url == "/signup"){
      var name = matches(req.body.username,patternNameAndAddress)
      var city = matches(req.body.city,patternNameAndAddress)
      var state = matches(req.body.state,patternNameAndAddress)
      var password = matches(req.body.password,patternPassword)
      if( name && city && state && password){ return next() }
      req.flash("message","One out of submitted values is invalid")
      res.redirect("/signup")
    }

    if (req.url == "/editprofile"){
      var body = []
      var tracker = []
      var checker = editProfileBodyChecker(req,body,tracker)
      if( checker ){ return next() }
      req.flash("message","One out of submitted values is invalid")
      res.redirect("/signup")
    }

    if (req.url == "/login"){
      var name = matches(req.body.username,patternNameAndAddress)
      var password = matches(req.body.password,patternPassword)
      if( name && password){ return next() }
      req.flash("message","Either Name or Password is invalid")
      res.redirect("/login")
    }

}

function matches(string,pattern){
  var match = string.match(pattern)
  if(match == null ){ return false }
  return true
}

function editProfileBodyChecker(req,body,tracker){

  if(!!req.body.username){
    var name = matches(req.body.username,patternNameAndAddress)
    body.push["param"]
    if(name){ tracker.push("done")}
  }

  if(!!req.body.city){
    var city = matches(req.body.city,patternNameAndAddress)
    body.push["param"]
    if(city){ tracker.push("done")}
  }

  if(!!req.body.state){
    var state = matches(req.body.state,patternNameAndAddress)
    body.push["param"]
    if(state){ tracker.push("done")}
  }

  if(!!req.body.password){
    var password = matches(req.body.password,patternPassword)
    body.push["param"]
    if(password){ tracker.push("done")}
  }

  return ( body.length == tracker.length )
}
