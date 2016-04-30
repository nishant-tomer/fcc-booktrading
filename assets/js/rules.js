$(document).ready(function () {


    $.validator.addMethod("alphabetical", function(value, element, regexpr) {
      return !(regexpr.test(value));
    }, "Only Letter and spaces allowed. Case sensitive");

    $.validator.addMethod("alphanumerical", function(value, element, regexpr) {
     return !(regexpr.test(value));
   }, "Only Letter and numbers allowed. Case sensitive");

   $("#form").validate({
        rules: {

          username:{
            required: true,
            alphabetical: /[^a-zA-Z ]+/,
            maxlength:40
          },
          city:{
            required: true,
            alphabetical: /[^a-zA-Z ]+/,
            maxlength:40
          },
          state:{
            required: true,
            alphabetical: /[^a-zA-Z ]+/,
            maxlength:40
          },
          password: {
              alphanumerical: /[^a-zA-Z0-9]+/,
               required: true,
               minlength: 6,
               maxlength: 15
           },
          confirmpassword: {
            required: true,
            alphanumerical: /[^a-zA-Z0-9]+/,
               minlength: 6,
               maxlength: 15,
           }
       }
   });

})
