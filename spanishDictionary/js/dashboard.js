function getClassroomIDNameSet(data) {
    let classroomIDArray = []
    let classroomNameArray = []

    const dashboardDataArray = JSON.parse(data)

    $.each(dashboardDataArray, function (i, dashboardData) {
        const classroomID = dashboardData.classID
        const classroomName = dashboardData.className

        classroomIDArray.push(classroomID)
        classroomNameArray.push(classroomName)
    })

    return {classroomIDArray: classroomIDArray, classroomNameArray: classroomNameArray}
}

function setAddClassroomButton() {
    $("#dashboard-header").after('<a id="add-classroom" class="btn dark col-sm-auto" href="./addClassroom.php"><i class="fas fa-plus"></i> Add Classroom</a>');
}

function getPersonalVocabIDArray(data) {
    let personalVocabIDArray = []

    const dashboardDataArray = JSON.parse(data)

    $.each(dashboardDataArray, function (i, dashboardData) {
        const personalVocabID = dashboardData.personalVocabID

        personalVocabIDArray.push(personalVocabID)
    })

    return personalVocabIDArray
}

function goToClassroom(classroomID, classroomName, personalVocabID) {
    const userData = {
        classroomID: classroomID,
        classroomName: classroomName,
        personalVocabID: personalVocabID    //will be -1 if role==="instructor"
    }
    addToSession(userData, 'goTo', './classroom.php')
}

//create html to classroom name. when clicked, go to classroom.php
function getClickableClassroomName(index, classroomID, classroomName, personalVocabID) {
    const classroomNameHTMLId = `classroom-name-${index}`
    let classroomNameHTML = `<button type="button" id="${classroomNameHTMLId}" class="btn btn-link" onclick='goToClassroom(${classroomID}, "${classroomName}", ${personalVocabID})'>${classroomName}</button>`

    return classroomNameHTML
}//end of getClickableClassroomName

//AJAX GET to get classroom list (array of classroom IDs & an array of classroomNames)
$(function () {
    const userData = {
        email: emailFromSession,
        role: roleFromSession
    }

    const URL = './services/dashboardService.php'
    const cardBody = "cardBody"

    $.get(URL, userData, function (data) {
        const role = roleFromSession
        const  classroomIDNameSet = getClassroomIDNameSet(data)
        const classroomIDArray = classroomIDNameSet.classroomIDArray
        const classroomNameArray = classroomIDNameSet.classroomNameArray
        let personalVocabIDArray = []
        let classroomNameHTML = '';

        if(role === "instructor") setAddClassroomButton()
        else if(role === "student") personalVocabIDArray = getPersonalVocabIDArray(data)

        $.each(classroomNameArray, function (index, classroomName) {
            const classroomID = classroomIDArray[index]
            const personalVocabID = personalVocabIDArray.length === 0 ? personalVocabIDArray[index] : -1 //if personalVocabIDArray is empty, then default personalVocabID is -1
            classroomNameHTML += getClickableClassroomName(index, classroomID, classroomName, personalVocabID)
            if((index + 1) <= classroomNameArray.length) { classroomNameHTML += '<br>'} //print breaks between classroom names
        })

        document.getElementById(cardBody).innerHTML = classroomNameHTML
    })
    .fail(function () {showErrorMessage(errorMsgId, URL)})
}) //end of doc ready