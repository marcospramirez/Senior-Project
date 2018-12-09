//check if name, email and password are alphanumeric and if passwords match
//if not, display error messages
function passedErrorCheckRegister(errorMsgId, name, email, password, passwordConfirm) {
    var errArray = []
    if($.trim(password) == '' || $.trim(passwordConfirm) == '') {//error: password(s) filled with spaces
        errArray.push("Invalid password(s). Password(s) filled with spaces.")
    }
    // if(!RegExp("^[\p{L}\s'.-]+$").test(name)) {//error: name is not alphanumeric
    //     errArray.push("Invalid name. Names must be alphanumeric.")
    // }
    if(!(RegExp("^[a-zA-Z0-9]*$").test(password) && RegExp("^[a-zA-Z0-9]*$").test(passwordConfirm))) {//error: passwords are not alphanumeric
        errArray.push("Invalid password(s). Passwords must be alphanumeric.")
    }
    if(password != passwordConfirm) {//error: passwords don't match
        errArray.push("Passwords do not match.")
    }

    //toString array
    if(errArray.length != 0) {
        let errorMsgString = errArray[0]
        if(errArray.length > 1) {  //if more than one error add br tag between errors
            for(let i = 1; i < errArray.length; i++) {
                errorMsgString += '<br>' + errArray[i]
            }
        }
        //display error message string in html
        document.getElementById(errorMsgId).innerHTML = errorMsgString
    }
    const result = errArray.length == 0  //check if any errors were saved in errArray
    return result
}//end of passedErrorCheckLogin

function registerStudent(URL, errorMsgId) {
  const name = $('#register-student-name').val()
  const email = $('#register-student-email').val()
  const password = $('#register-student-password').val()
  const passwordConfirm = $('#register-student-password-confirm').val()

  //client-end error checking
  if(passedErrorCheckRegister(errorMsgId, name, email, password, passwordConfirm)) {
      //process AJAX request
      const userData = {
          user: "STUDENT",
          name: name,
          email: email,
          password: password
      }
      $.post(URL, userData, function(data) {
          if(data == "success") {  //user was inserted correctly!
              $('#register-student-name').val('') //clear name input field
              $('#register-student-email').val('') //clear email input field
              $('#register-student-password').val('') //clear password input field
              $('#register-student-password-confirm').val('') //clear password confirm input field
              showLogin()
              document.getElementById("register-success-message").innerHTML = 'Registered Successfully!'
          } else if(data == "duplicate") {  //username is not available
              document.getElementById(errorMsgId).innerHTML = 'Username is not available.'
          } else {
              document.getElementById(errorMsgId).innerHTML = 'Error! ' + data
          }
      }) //end of $.post
          .fail(function() {
                  document.getElementById(errorMsgId).innerHTML = `Error, could not post! URL: ${URL} | User Data: ${userData}`
          })//end of $.fail


  } //end of if: passedErrorCheckLogin
}//end of registerStudent

function registerInstructor(URL, errorMsgId) {
    const name = $('#register-instructor-name').val()
    const email = $('#register-instructor-email').val()
    const password = $('#register-instructor-password').val()
    const passwordConfirm = $('#register-instructor-password-confirm').val()

    //client-end error checking
    if(passedErrorCheckRegister(errorMsgId, name, email, password, passwordConfirm)) {
        //process AJAX request
        const userData = {
            user: "INSTRUCTOR",
            name: name,
            email: email,
            password: password
        }
        $.post(URL, userData, function(data) {
            if(data == "success") {  //user was inserted correctly!
                $(`#register-instructor-name`).val('') //clear name input field
                $('#register-instructor-email').val('') //clear email input field
                $('#register-instructor-password').val('') //clear password input field
                $('#register-instructor-password-confirm').val('') //clear password confirm input field
                showLogin()
                document.getElementById("register-success-message").innerHTML = 'Registered Successfully!'
            } else if(data == "duplicate") {  //username is not available
                document.getElementById(errorMsgId).innerHTML = 'Username is not available.'
            } else {
                document.getElementById(errorMsgId).innerHTML = 'Error! ' + data
            }
        }) //end of $.post
            .fail(function() {
                document.getElementById(errorMsgId).innerHTML = `Error, could not post! URL: ${URL} | User Data: ${userData}`
            })//end of $.fail


    } //end of if: passedErrorCheckLogin
}//end of registerInstructor

//jQuery to load AFTER doc is loaded
$(function(){
    //set form variable
    let studentForm = $('#register-student-form')
    let instructorForm = $('#register-instructor-form')
    let errorMsgId = ''
    const URL = `./services/register.php`

    //hijack student register form
    studentForm.submit(function(event) {
      event.preventDefault()

      //clear error messages
      errorMsgId = 'register-student-error-message'
      document.getElementById(errorMsgId).innerHTML = ''

      registerStudent(URL, errorMsgId)
    })

    //hijack instructor register form
    instructorForm.submit(function(event) {
      event.preventDefault()

      //clear error messages
      errorMsgId = 'register-instructor-error-message'
      document.getElementById(errorMsgId).innerHTML = ''

      registerInstructor(URL, errorMsgId)
    })
}) //end of doc ready
