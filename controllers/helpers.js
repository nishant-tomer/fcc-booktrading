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
      var confirmpassword = matches(req.body.confirmpassword,patternPassword)
      if( password != confirmpassword ){
        req.flash("message","passwords don't match")
        res.redirect("/signup")
       }
      if( name && city && state && password && confirmpassword ){  return next() }
      req.flash("message","One out of all of submitted values is invalid")
      res.redirect("/signup")
    }

    if (req.url == "/editprofile"){
      if( req.body.newpassword != req.body.confirmnewpassword ){
        req.flash("message","passwords don't match")
        res.redirect("/profile")
       }
      var body = []
      var tracker = []
      var checker = editProfileBodyChecker(req,body,tracker)
      if( checker ){ return next() }
      req.flash("message","One out of all of submitted values is invalid")
      res.redirect("/profile")
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

  var patternNameAndAddress = /[a-z A-Z]+/
  var patternPassword = /[a-z A-Z0-9]{6,}/

  if(req.body.newusername.length != 0){
    var newname = matches(req.body.newusername,patternNameAndAddress)
    body.push("param")
    if(newname){ tracker.push("done")}
  }

  if(req.body.newcity.length != 0){
    var newcity = matches(req.body.newcity,patternNameAndAddress)
    body.push("param")
    if(newcity){ tracker.push("done")}
  }

  if(req.body.newstate.length != 0){
    var newstate = matches(req.body.newstate,patternNameAndAddress)
    body.push("param")
    if(newstate){ tracker.push("done")}
  }

  if(req.body.newpassword.length != 0){
    var newpassword = matches(req.body.newpassword,patternPassword)
    body.push("param")
    if(newpassword){ tracker.push("done")}
  }

  if(req.body.confirmnewpassword.length != 0){
    var confirmnewpassword = matches(req.body.confirmnewpassword,patternPassword)
    body.push("param")
    if(confirmnewpassword){ tracker.push("done")}
  }

  if(req.body.oldpassword.length != 0){
    var oldpassword = matches(req.body.oldpassword,patternPassword)
    body.push("param")
    if(oldpassword){ tracker.push("done")}
  }
  var checker = body.length == tracker.length 
  return checker
}
