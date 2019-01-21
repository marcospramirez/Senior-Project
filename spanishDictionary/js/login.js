//check if name, email and password are alphanumeric and if passwords match
//if not, display error messages
function passedErrorCheckLogin(errorMsgId, email, password) {
    var errArray = []
    if($.trim(password) == '') {//error: password(s) filled with spaces
        errArray.push("Invalid password. Password is filled with spaces.")
    }
    if(!RegExp("^[a-zA-Z0-9]*$").test(password)) {//error: password is not alphanumeric
        errArray.push("Invalid password. Password must be alphanumeric.")
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

//jQuery to load AFTER doc is loaded
$(function(){
    //set form variable
    let form = $('#login-form')
    let errorMsgId = ''
    const URL = `./services/login.php`

    //hijack student register form
    form.submit(function(event) {
        event.preventDefault()

        //clear error messages
        errorMsgId = 'login-error-message'
        document.getElementById(errorMsgId).innerHTML = ''

        const email = $('#login-email').val()
        const password = $('#login-password').val()

        //client-end error checking
        if(passedErrorCheckLogin(errorMsgId, email, password)) {
            //process AJAX request
            const userData = {
                email: email,
                password: password
            }
            $.post(URL, userData, function(permission) {
                if(permission == "instructor") {  //authenticated instructor, redirect to instructor dashboard
                    window.location.replace(`./dashboard.php?email=${email}&permission=${permission}`)
                } else if(permission == "student") {  //authenticated student, redirect to student dashboard
                    window.location.replace(`./dashboard.php?email=${email}&permission=${permission}`)
                } else if(permission == "none") { //invalid credentials
                    document.getElementById(errorMsgId).innerHTML = 'Invalid username or password.'
                } else {
                    document.getElementById(errorMsgId).innerHTML = 'Error! ' + permission
                }
            }) //end of $.post
                .fail(function() {
                    document.getElementById(errorMsgId).innerHTML = `Error, could not post! URL: ${URL} | User Data: ${userData}`
                })//end of $.fail


        } //end of if: passedErrorCheckLogin
    })
}) //end of doc ready