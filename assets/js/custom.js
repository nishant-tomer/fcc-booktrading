$(document).ready(function () {

    var allSections = $("#searchBooks, #allBooks, #allMyBooks, #borrowedBooks, #lentBooks, #borrowal, #lending, #editProfile")

    // to clear the display area
    function clear (){
      allSections.addClass("no-display")
    }

    // to trigger display of relevant Section
    function displaySection (element){
      clear()
      $(element).removeClass("no-display")
    }

    // to stop default behaviour
    function prevent (event){
      event.preventDefault()
      event.stopPropagation()
    }

    // Next section of event handlers pertains to Left-pane navigation
    $("#searchBooksLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )
    })

    $("#allBooksLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )

    })

    $("#allMyBooksLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )
    })

    $("#borrowedBooksLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )
    })

    $("#lentBooksLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )
    })

    $("#borrowalLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )
    })

    $("#lendingLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )
    })

    $("#editProfileLink").click(function(event){
      prevent(event)
      var id = $(this).attr("id").slice(0,-4)
      displaySection( $( "#"+id ) )
    })

    $("#cancel").click(function(event){
      prevent(event)
      $("input").val("")
    })


    // attach auto-complete functionality to searchInputBox
    $("#searchInput").autocomplete({
       source: function (request, response) {
           var booksUrl = "https://www.googleapis.com/books/v1/volumes?printType=books" +
                          "&key=AIzaSyAkP2-5jhLpL7m6UkWKK94lFLKhfpWBNuA"+
                          "&q="+ encodeURIComponent(request.term);
           $.ajax({
               url: booksUrl,
               dataType: "jsonp",
               success: function(data) {
                   response($.map(data.items, function (item) {
                       if (item.volumeInfo.authors && item.volumeInfo.title && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate)
                       {
                           return {
                               label: item.volumeInfo.title + ', ' + item.volumeInfo.authors[0] + ', ' + item.volumeInfo.publishedDate,
                               value: item.volumeInfo.title,
                               title: item.volumeInfo.title,
                               author: item.volumeInfo.authors[0],
                               isbn: item.volumeInfo.industryIdentifiers,
                               publishedDate: item.volumeInfo.publishedDate,
                               image: (item.volumeInfo.imageLinks == null ? "" : item.volumeInfo.imageLinks.thumbnail),
                               description: item.volumeInfo.description,
                           };
                       }
                   }));
               },
               error: function(error){
                 $('#searchBooksResults').html("");
                 var el = "<h2> No autocomplete Available due to <h4>" + error + "</h4></h2>"
                 el.appendTo('#searchBooksResults')
                 displaySection( $('#searchBooks') )
               }

           });
       },
       select: function (event, ui) {
           $('#searchBooksResults').html("");
           displaySection( $('#searchBooks') )
           appendAuto( ui.item,{"modal":false} );
       },
       minLength: 1

   // To close autocomplete after user hits ENTER without selecting any suggestions.
 }).keypress(function (e) {
        if(e.which === 13) {
            $( "#searchInput" ).autocomplete( "close" );
        }
    });

   // submit handler for searchInputBox
   $('#searchForm').on('submit', function (event) {
       prevent(event)
       var booksUrl = "https://www.googleapis.com/books/v1/volumes?printType=books" +
                      "&key=AIzaSyAkP2-5jhLpL7m6UkWKK94lFLKhfpWBNuA"+
                      "&q="+ encodeURIComponent($("#searchInput").val());
       $.ajax({
           url: booksUrl,
           dataType: "jsonp",
           success: function(data) {
               $('#searchBooksResults').html("");
               displaySection( $('#searchBooks') )
               data.items.forEach( function (item, index) {
                 var book = {}
                 if (item.volumeInfo.authors && item.volumeInfo.title && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate)
                 {
                     book.title = item.volumeInfo.title
                     book.author = item.volumeInfo.authors[0]
                     book.description = item.volumeInfo.description
                     book.isbn = item.volumeInfo.industryIdentifiers
                     book.publishedDate = item.volumeInfo.publishedDate
                     book.image = item.volumeInfo.imageLinks == null ? "" : item.volumeInfo.imageLinks.thumbnail
                 }
                 // see append function for options' presence
                 append(book,{ "addbook": true })
               });
           },
          error: function(error){
            $('#searchBooksResults').html("");
            var el = "<h2> No Results Available due to <h4>" + error + "</h4></h2>"
            el.appendTo('#searchBooksResults')
            displaySection( $('#searchBooks') )
          }
       });
       return false
   })

   //To trigger Description modal

   $(document).on("click",".details",function(event){
     prevent(event)
     var item = JSON.parse( $(this).attr("id") )
     $("#modalDetails").html("")
     appendAuto(item,{"modal":true})
   })

   $(document).on("click",".action",function(event){
     prevent(event)
     var item = JSON.parse( $(this).attr("id") )
     var action = $(this).text()
     var url = ""
     if(action == "Add"){ url = "/add" ; execute(url, item) }
     else if(action == "Remove"){ url = "/remove" ; execute(url, item) }
     else if(action == "Borrow"){ url = "/borrow"  ; execute(url, item) }
     else if(action == "Return"){ url = "/return" ; execute(url, item) }
     else if(action == "Accept"){ url = "/accept" ; execute(url, item) }
     else if(action == "Revert"){ url = "/revert" ; execute(url, item) }
     else if(action == "Take Back"){ url = "/takeback"  ; execute(url, item) }
   })

   // Validations for editProfile section
  $.validator.addMethod("alphabetical", function(value, element, regexpr) {
        return !(regexpr.test(value));
      }, "Only Letter and spaces allowed. Case sensitive");

  $.validator.addMethod("alphanumerical", function(value, element, regexpr) {
       return !(regexpr.test(value));
     }, "Only Letter and numbers allowed. Case sensitive");

   $("#editProfileForm").validate({
          rules: {

            newusername:{
              alphabetical: /[^a-zA-Z ]+/,
              maxlength:40
            },
            newcity:{
              alphabetical: /[^a-zA-Z ]+/,
              maxlength:40
            },
            newstate:{
              alphabetical: /[^a-zA-Z ]+/,
              maxlength:40
            },
            oldpassword: {
              alphanumerical: /[^a-zA-Z0-9]+/,
                 required: true,
                 minlength: 6,
                 maxlength: 15
             },
            newpassword: {
              alphanumerical: /[^a-zA-Z0-9]+/,
                 minlength: 6,
                 maxlength: 15,

             },
            confirmnewpassword: {
              alphanumerical: /[^a-zA-Z0-9]+/,
                 minlength: 6,
                 maxlength: 15,
             }
         }
     });
     // Helper functions for Catalog Manipulation

     function execute(url,item){
       $.ajax({
           type: "POST",
           url: url,
           data: JSON.stringify(item),
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           success: function(data) {
               $('#msg').html(data.message + " Try reloading.");
               $('#msg').show(500);
               hide();
           },
          error: function(error){
            $('#msg').html(error);
            $('#msg').show(500);
            hide();
          }
       });
     }

     //helper functions for search functionality
    function append(item, options) {
          var el = $("#item").clone(true)

          if ( item.image != '') {
            el.find("#img").attr("src", item.image );
          }else{
            el.find("#img").attr("alt", "Image Not Available");
          }

          el.find("#title").html( item.title );
          el.find("#author").html( item.author );
          el.find("#publishedDate").html( item.publishedDate );
          if (item.isbn && item.isbn[0].identifier){
            el.find("#isbn").html( item.isbn[0].identifier );
          }else {
            el.find("#isbn").html("Not Available");
          }

          el.find(".action").attr("id", JSON.stringify(item))
          el.find(".details").attr("id", JSON.stringify(item))

          // Check which section is item getting appended to.
          if(!!options.addbook){
            el.find(".action").text("Add")
            el.appendTo("#searchBooksResults");
          }
          else if (!!options.removebook) {
            el.find(".action").text("Remove")
            el.appendTo("#allMyBooks");
           }
          else if (!!options.sendrequest) {
            el.find(".action").text("Borrow")
            el.appendTo("#allBooks");
           }
          else if (!!options.returnbook) {
            el.find(".action").text("Return")
            el.appendTo("#borrowedBooks");
           }
          else if (!!options.acceptrequest) {
            el.find(".action").text("Accept")
            el.appendTo("#lending");
           }
          else if (!!options.revertrequest) {
            el.find(".action").text("Revert")
            el.appendTo("#borrowal");
           }
          else if (!!options.takebackbook) {
            el.find(".action").text("Take Back")
            el.appendTo("#lentBooks");
           }


      return
    }

    function appendAuto(item, options){
      var el = $("#itemAuto").clone(true)
      if (item.image != '') {
         el.find("#img").attr("src", item.image );
       }else{
         el.find("#img").attr("alt", "Image Not Available");
       }

      el.find("#title").html( item.title );
      el.find("#author").html( item.author );
      el.find("#publishedDate").html( item.publishedDate );
      el.find("#description").html( item.description );

      if (item.isbn && item.isbn[0].identifier){
         el.find("#isbn").html( item.isbn[0].identifier );
         el.find("#worldcat").attr("href",'http://www.worldcat.org/isbn/' + item.isbn[0].identifier);
      }else {
        el.find("#isbn").html("Not Available");
        el.find("#worldcat").attr("href",'#');
      }


      if (!!options.modal) {
        el.find(".action").remove()
        el.appendTo("#modalDetails")
      }else {
        el.find(".action").attr("id", JSON.stringify(item))
        el.appendTo('#searchBooksResults')
      }
      return
    }


    // Hide welcome-message
    function hide(){
        setTimeout(function() {
          $("#msg").hide( 500)
        }, 3000);
    }
    hide()

    $.ajax({
            url : "/books",
            dataType: "json",
            success: populator,
            error: function(err){
              $('#msg').html(error);
              $('#msg').show(500);
              hide();
            }
          })

    function populator(data){

      if(!!data.message){
        $('#msg').html(data.message + " Try reloading.");
        $('#msg').show();
        hide();

      }else {
        for (var key in data) {
            if (!data.hasOwnProperty(key)) { continue }
            var booksArray = data[key]
            if( key == "allBooks"){
              if ( booksArray.length > 0 ) {
                booksArray.forEach( function (book, index) {
                    book = JSON.parse( book )
                    append(book,{ "sendrequest": true })
                });
              }
            }

            else if( key == "books"){
              booksArray.forEach( function (book, index) {
                   book = JSON.parse( book )
                   console.log(book)
                   console.log( typeof(book))
                   append(book,{ "removebook": true })
              });
            }
            else if (key == "borrowal") {
              booksArray.forEach( function (book, index) {
                  book = JSON.parse( book )
                   append(book,{ "revertrequest": true })
              });
            }
            else if (key == "lending") {
              booksArray.forEach( function (book, index) {
                  book = JSON.parse( book )
                   append(book,{ "acceptrequest": true })
              });
            }
            else if (key == "lent") {
              booksArray.forEach( function (book, index) {
                  book = JSON.parse( book )
                   append(book,{ "takebackbook": true })
              });
            }
            else if (key == "borrowed") {
              booksArray.forEach( function (book, index) {
                    book = JSON.parse( book )
                   append(book,{ "returnbook": true })
              });
            }
        }
      }
    }

})
