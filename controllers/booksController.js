var User = require("../models/user")

var booksController = module.exports = {}

booksController.getAll = function(req,res){

  User.find({}, function(err, docs){
    if(err){  res.json({"message":"Unable to get the Catalog."}) }
    var response = { allBooks: [] }
    docs.forEach( function(user){
      if( user._id == req.user._id ){
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

  var book = JSON.parse( req.params.item )
  book.owner = req.user.username
  book = JSON.stringify(book)
  User.findOneAndUpdate({_id:req.user._id}, { $addToSet: { books: book } }, {new: true}, function(err, doc){
    if(err){  res.json({"message":"Unable to add the book."}) }
    res.json({"message":"Book added succesfully!"})
  });
}

booksController.remove = function(req,res){

  var book = req.params.item
  User.findOneAndUpdate({_id:req.user._id}, { $pull: { books: { $in: book }}}, {new: true}, function(err, doc){
    if(err){  res.json({"message":"Unable to remove the book."}) }
    res.json({"message":"Book removed succesfully!"})
  });
}

// Borrow - Revert - Accept

booksController.borrow = function(req,res){
  var book = JSON.parse( req.params.item )
  var owner = book.owner
  book.requester = req.user.username
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:owner}, { $addToSet: { lending : book } }, {new: true}, function(err, doc){
    if(err){  res.json({"message":"Unable to request the book."}) }

    User.findOneAndUpdate({_id:req.user._id}, { $addToSet: { borrowal: book } }, {new: true}, function(err, doc){
      if(err){  res.json({"message":"Unable to request the book."}) }
      res.json({"message":"Book requested succesfully!"})
    });
  })
}

booksController.accept = function(req,res){
  var book = JSON.parse( req.params.item )
  book.borrower = book.requester
  var borrower = book.borrower
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:req.user.username}, { $pull: { lending : book }, $addToSet:{ lent:book } }, {new: true}, function(err, doc){
    if(err){  res.json({"message":"Unable to accept the request."}) }
    User.findOneAndUpdate({username:borrower }, { $pull: { borrowal : book }, $addToSet:{ borrowed : book } }, {new: true}, function(err, doc){
      if(err){  res.json({"message":"Unable to accept the request."}) }
      res.json({"message":"Request accepted succesfully!"})
    });
  })
}

booksController.revert = function(req,res){
  var book = JSON.parse( req.params.item )
  book.requester = ""
  var owner = book.owner
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:req.user.username}, { $pull: { borrowal : book } }, {new: true}, function(err, doc){
    if(err){  res.json({"message":"Unable to revert the request."}) }
    User.findOneAndUpdate({username:owner }, { $pull: { lending : book } }, {new: true}, function(err, doc){
      if(err){  res.json({"message":"Unable to revert the request."}) }
      res.json({"message":"Request reverted succesfully!"})
    });
  })
}

// Return -  Takeback

booksController.return = function(req,res){
  var book = JSON.parse( req.params.item )
  var owner = book.owner
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:owner}, { $pull: { lent : book } }, {new: true}, function(err, doc){
    if(err){  res.json({"message":"Unable to return the book. "}) }
    User.findOneAndUpdate({username:req.user.username}, { $pull: { borrowed: book } }, {new: true}, function(err, doc){
      if(err){  res.json({"message":"Unable to return the book. "}) }
      res.json({"message":"Book returned succesfully!"})
    });
  })
}


booksController.takeback = function(req,res){
  var book = JSON.parse( req.params.item )
  var borrower = book.borrower
  book.borrower = ""
  book = JSON.stringify(book)
  User.findOneAndUpdate({username:borrower}, { $pull: { borrowed : book } }, {new: true}, function(err, doc){
    if(err){  res.json({"message":"Unable to return the book. "}) }
    User.findOneAndUpdate({username:req.user.username}, { $pull: { lent: book } }, {new: true}, function(err, doc){
      if(err){  res.json({"message":"Unable to return the book. "}) }
      res.json({"message":"Book returned succesfully!"})
    });
  })
}
