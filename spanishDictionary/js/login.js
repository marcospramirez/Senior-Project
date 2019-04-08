//check if name, email and password are alphanumeric and if passwords match
//if not, display error messages
function passedErrorCheckLogin(errorMsgId, email, password) {
    let errArray = []
    if($.trim(password) === '') {//error: password(s) filled with spaces
        errArray.push("Invalid password. Password is filled with spaces.")
    }
    if(!RegExp("^[a-zA-Z0-9]*$").test(password)) {//error: password is not alphanumeric
        errArray.push("Invalid password. Password must be alphanumeric.")
    }
    //toString array
    if(errArray.length !== 0) {
        let errorMsgString = errArray[0]
        if(errArray.length > 1) {  //if more than one error add br tag between errors
            for(let i = 1; i < errArray.length; i++) {
                errorMsgString += '<br>' + errArray[i]
            }
        }
        //display error message string in html
        document.getElementById(errorMsgId).innerHTML = errorMsgString
    }
    const result = errArray.length === 0  //check if any errors were saved in errArray
    return result
}//end of passedErrorCheckLogin

// hijack form & authenticate user. If authentic, redirect to dashboard.
$(function(){
    //set form variable
    let form = $('#login-form')
    let errorMsgId = ''
    const URL = './services/login.php'

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
            $.post(URL, userData, function(data) {
                if(data === "instructor" || data === "student") addToSession({email: email, role: data}, 'redirectTo', './dashboard.php')   //authenticated user, add email and role to the session & redirect to the dashboard
                else if(data === "new instructor") addToSession({email: email, role: "instructor"}, 'redirectTo', './addClassroom.php') //authenticated new instructor, add email and role to the session & redirect to add classrooms
                else if(data === "none") document.getElementById(errorMsgId).innerHTML = 'Invalid username or password.'    //invalid credentials
                else document.getElementById(errorMsgId).innerHTML = 'Error! ' + data   //backend error
            }) //end of $.post
            .fail(function() { showErrorMessage(errorMsgId, URL) })
        } //end of if: passedErrorCheckLogin
    })
}) //end of doc ready