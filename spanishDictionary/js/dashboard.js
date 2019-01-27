//AJAX GET to get classroom list (array of classroom IDs & an array of classroomNames)
$(function () {
    //todo: role vs userType? Is "role" used elsewhere, in case it would be easier to change userType
    const userData = {
        email: emailFromSession,
        userType: userTypeFromSession
    }
    const URL = './services/dashboard.php'
    const cardBody = 'card-body'

    $.get(URL, userData, function (data) {
        //todo: parse data back into two arrays, one that holds the classroomIDs and one that holds the classroomNames
        const classroomIDArray = [];
        const classroomNameArray = [];
        let classroomNameHTML = '';

        $.each(classroomNameArray, function (index, classroomName) {
            classroomNameHTML += classroomName  //todo: make classroom names clickable/go to classroom.php
            if((index + 1) <= classroomNameArray.length) { classroomNameHTML += '<br>'} //print breaks between classroom names
            
        })
    })
        .fail(function () {
            document.getElementById(cardBody).innerHTML = `Error, could not post! URL: ${URL}`
        })
}) //end of doc ready