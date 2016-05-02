var User = require("../models/user")

var booksController = module.exports = {}

booksController.getAll = function(req,res){

  User.find({}, function(err, docs){
    if(err){  res.json({"message":"Unable to get the Catalog."}) }
    var response = { allBooks : []}
    docs.forEach( function(user){

      if( user.username == req.user.username ){
            response.books     = user.books
            response.borrowed  = user.borrowed
            response.lent      = user.lent
            response.borrowal  = user.borrowal
            response.lending   = user.lending

      } else {
        user.books.forEach( function(book){
          response.allBooks.push(book)
        })
      }
    })
    res.json( response )
  });
}



// Add - Remove
booksController.add = function(req,res){
  var book = req.body
  book.owner = req.user.username
  var book =  JSON.stringify(req.body)
  User.findOneAndUpdate({username:req.user.username}, { $addToSet: { books: book } }, {new: true}, function(err, doc){
    if(err){ console.log(err);  res.json({"message":"Unable to add the book."}) }
    res.json({"message":"Book added succesfully!"})
  });
}

booksController.remove = function(req,res){
  var book =  JSON.stringify(req.body)
  User.findOneAndUpdate({username:req.user.username}, { $pull: { books: { $in: [book] }}}, {new: true}, function(err, doc){
    if(err){ console.log(err); res.json({"message":"Unable to remove the book."}) }
    res.json({"message":"Book removed succesfully!"})
  });
}

// Borrow - Revert - Accept

booksController.borrow = function(req,res){
  var book = req.body
  var owner = book.owner
  book.requester = req.user.username
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:owner}, { $addToSet: { lending : book } }, {new: true}, function(err, doc){
    if(err){  console.log(err) ;res.json({"message":"Unable to request the book."}) }
    User.findOneAndUpdate({username:req.user.username}, { $addToSet: { borrowal: book } }, {new: true}, function(err, doc){
      if(err){  console.log(err); res.json({"message":"Unable to request the book."}) }
      res.json({"message":"Book requested succesfully!"})
    });
  })
}

booksController.acceptrequest = function(req,res){
  var origbook = req.body
  var book = origbook
  origbook =  JSON.stringify(origbook)
  book.borrower = book.requester
  var borrower = book.borrower
  book = JSON.stringify(book)

  User.findOneAndUpdate({username:req.user.username}, { $pull: { lending : { $in: [origbook] } }, $addToSet:{ lent : book } }, {new: true}, function(err, doc){
    if(err){  console.log(err) ;res.json({"message":"Unable to accept the request."}) }
    User.findOneAndUpdate({username:borrower }, { $pull: { borrowal : { $in: [origbook] } }, $addToSet:{ borrowed : book } }, {new: true}, function(err, doc){
      if(err){  console.log(err); res.json({"message":"Unable to accept the request."}) }
      res.json({"message":"Request accepted succesfully!"})
    });
  })
}

booksController.revert = function(req,res){
  var book =  req.body
  var owner = book.owner
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:req.user.username}, { $pull: { borrowal :{ $in: [book] }} }, {new: true}, function(err, doc){
    if(err){  console.log(err); res.json({"message":"Unable to revert the request."}) }
    User.findOneAndUpdate({username:owner }, { $pull: { lending :{ $in: [book] }} }, {new: true}, function(err, doc){
      if(err){  console.log(err); res.json({"message":"Unable to revert the request."}) }
      res.json({"message":"Request reverted succesfully!"})
    });
  })
}

// Return -  Takeback

booksController.return = function(req,res){
  var book =  req.body
  var owner = book.owner
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:owner}, { $pull: { lent :{ $in: [book] } } }, {new: true}, function(err, doc){
    if(err){   console.log(err); res.json({"message":"Unable to return the book. "}) }
    User.findOneAndUpdate({username:req.user.username}, { $pull: { borrowed: { $in: [book] } } }, {new: true}, function(err, doc){
      if(err){   console.log(err); res.json({"message":"Unable to return the book. "}) }
      res.json({"message":"Book returned succesfully!"})
    });
  })
}


booksController.takeback = function(req,res){
  var book =  req.body
  var borrower = book.borrower
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:borrower}, { $pull: { borrowed : { $in: [book] } } }, {new: true}, function(err, doc){
    if(err){  console.log(err); res.json({"message":"Unable to takeback the book. "}) }
    User.findOneAndUpdate({username:req.user.username}, { $pull: { lent: { $in: [book] } } }, {new: true}, function(err, doc){
      if(err){  console.log(err); res.json({"message":"Unable to takeback the book. "}) }
      res.json({"message":"Book taken succesfully!"})
    });
  })
}
