function getClassroomIDNameSet(data) {
    let classroomIDArray = []
    let classroomNameArray = []

    const classroomIDNameData = JSON.parse(data)

    $.each(classroomIDNameData, function (i, classroomIDName) {
        const classroomID = classroomIDName.classID
        const classroomName = classroomIDName.className

        classroomIDArray.push(classroomID)
        classroomNameArray.push(classroomName)
    })

    return {classroomIDArray: classroomIDArray, classroomNameArray: classroomNameArray}
}

function goToClassroom(classroomID, classroomName) {
    const userData = {
        classroomID: classroomID,
        classroomName: classroomName
    }
    addToSessionAndMoveToPage(userData, 'goTo', './classroom.php')
}

//create html to classroom name. when clicked, go to classroom.php
function appendClickableClassroomName(index, classroomID, classroomName) {
    const classroomNameHTMLId = `classroom-name-${index}`
    let classroomNameHTML = `<button type="button" id="${classroomNameHTMLId}" class="btn btn-link" onclick="goToClassroom(${classroomID}, ${classroomName})">${classroomName}</button>`


    // //if name is clicked, add classroomID & classroomName to session & go to classroom.php
    // $(`#${classroomNameHTMLId}`).on( "click", function () {
    //
    // })

    return classroomNameHTML
}//end of appendClickableClassroomName

//AJAX GET to get classroom list (array of classroom IDs & an array of classroomNames)
$(function () {
    const userData = {
        email: emailFromSession,
        role: roleFromSession
    }

    const URL = './services/dashboardService.php'
    const cardBody = "cardBody"

    $.get(URL, userData, function (data) {
        //todo: i'm also getting personalVocabID of the classroom, add that to the session
        const  classroomIDNameSet = getClassroomIDNameSet(data)
        const classroomIDArray = classroomIDNameSet.classroomIDArray
        const classroomNameArray = classroomIDNameSet.classroomNameArray
        let classroomNameHTML = '';

        $.each(classroomNameArray, function (index, classroomName) {
            const classroomID = classroomIDArray[index]
            classroomNameHTML += appendClickableClassroomName(index, classroomID, classroomName)
            if((index + 1) <= classroomNameArray.length) { classroomNameHTML += '<br>'} //print breaks between classroom names
        })

        document.getElementById(cardBody).innerHTML = classroomNameHTML
    })
        .fail(function () {
            document.getElementById(cardBody).innerHTML = `Error, could not post! URL: ${URL}`
        })
}) //end of doc ready