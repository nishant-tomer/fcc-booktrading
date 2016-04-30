$(document).ready(function () {

    var allSections = $("#searchBooks, #searchBooksResults, #allBooks, #allMyBooks, #borrowedBooks, #lentBooks, #borrowal, #lending, #editProfile")

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

    // // submit handler for book search form
    // $('#searchForm').on('submit', function (event) {
    //     prevent(event)
    //     alert('Form submitted!')
    //     return false
    // })

    // attach auto-complete functionality to textbox
    $("#searchInput").autocomplete({
       // define source of the data
       source: function (request, response) {
           // url link to google books, including text entered by user (request.term)
           var booksUrl = "https://www.googleapis.com/books/v1/volumes?printType=books&q=" + encodeURIComponent(request.term);
           $.ajax({
               url: booksUrl,
               dataType: "jsonp",
               success: function(data) {
                   response($.map(data.items, function (item) {
                       if (item.volumeInfo.authors && item.volumeInfo.title && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate)
                       {
                           return {
                               // label value will be shown in the suggestions
                               label: item.volumeInfo.title + ', ' + item.volumeInfo.authors[0] + ', ' + item.volumeInfo.publishedDate,
                               // value is what gets put in the textbox once an item selected
                               value: item.volumeInfo.title,
                               // other individual values to use later
                               title: item.volumeInfo.title,
                               author: item.volumeInfo.authors[0],
                               isbn: item.volumeInfo.industryIdentifiers,
                               publishedDate: item.volumeInfo.publishedDate,
                               image: (item.volumeInfo.imageLinks == null ? "" : item.volumeInfo.imageLinks.thumbnail),
                               description: item.volumeInfo.description,
                           };
                       }
                   }));
               }
           });
       },
       select: function (event, ui) {
           // what to do when an item is selected
           // first clear anything that may already be in the description
           $('#searchBooks').html("");
           // we get the currently selected item using ui.item
           // show a pic if we have one
           if (item.image != '')
           {
               $('#searchBooks').append('<img src="' + ui.item.image + '" style="float: left; padding: 10px;">');
           }
           // and title, author, and year
           $('#searchBooks').append('<p><b>Title:</b> ' + ui.item.title  + '</p>');
           $('#searchBooks').append('<p><b>Author:</b> ' + ui.item.author  + '</p>');
           $('#searchBooks').append('<p><b>First published year:</b> ' + ui.item.publishedDate  + '</p>');
           // and the usual description of the book
           $('#searchBooks').append('<p><b>Description:</b> ' + ui.item.description  + '</p>');
           // and show the link to oclc (if we have an isbn number)
           if (ui.item.isbn && ui.item.isbn[0].identifier)
           {
               $('#searchBooks').append('<P><b>ISBN:</b> ' + ui.item.isbn[0].identifier + '</p>');
               $('#searchBooks').append('<a href="http://www.worldcat.org/isbn/' + ui.item.isbn[0].identifier + '" target="_blank">View item on worldcat</a>');
           }

           displaySection( $('#searchBooks') )
       },
       minLength: 2 // set minimum length of text the user must enter
   })

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

})
