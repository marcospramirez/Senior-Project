function getFileNameFromPath() {
    const url = window.location.pathname
    const filename = url.substring(url.lastIndexOf('/')+1)
    return filename
}

function hideGoToDictionaryBtn() {
    let goToDictBtn = document.getElementById("go-to-dict-btn")
    goToDictBtn.innerHTML = ''

    document.getElementById("add-to-dict-success-message").innerHTML = ''   //clear success message
}

function showGoToDictionaryBtn(dictionaryID, dictionaryName, successMessage = '') {
    let goToDictBtn = document.getElementById("go-to-dict-btn")
    const userData = {
        dictionaryID:dictionaryID,
        dictionaryName: dictionaryName
    }
    goToDictBtn.innerHTML = `<button class="btn dark" onclick="addToSession(${userData}, 'goTo', './dictionary.php')">Go to Dictionary</button>`
    goToDictBtn.style.display = 'block'

    document.getElementById("add-to-dict-success-message").innerHTML = successMessage
}

function getDictionaryOptions(dictionaryIDNameSet) {
    const dictionaryIDArray = dictionaryIDNameSet.dictionaryIdArray
    const dictionaryNameArray = dictionaryIDNameSet.dictionaryNameArray
    let optionListHTML = ''

    $.each(dictionaryIDArray, function(i, v) {
        optionListHTML += `<option value="${dictionaryIDArray[i]}">${dictionaryNameArray[i]}</option>`  //add option to option list
    })

    return optionListHTML
}

function getDictionaryIdNameSet(data) {
    let dictionaryIDArray = []
    let dictionaryNameArray = []

    const dictionaryIDNameData = JSON.parse(data)

    $.each(dictionaryIDNameData, function (i, dictionaryNameID) {
        const dictionaryID = dictionaryNameID.dictionaryID
        const dictionaryName = dictionaryNameID.dictionaryName

        dictionaryIDArray.push(dictionaryID)
        dictionaryNameArray.push(dictionaryName)
    })

    return {dictionaryIdArray: dictionaryIDArray, dictionaryNameArray: dictionaryNameArray}
}//end of getDictionaryIdNameSet

function addHiddenInputToForm(form, name, data) {
    form.append(`<input type="hidden" name="${name}" value="${data}">`)
}

//add user data to session and then move to a different file.
//movementFlag (optional): "redirectTo"- move to different file without adding the movement to the history stack
//                         "goTo"- move to a different file, adding the movement to the history stack
//         URL (optional): if moving to a page, this is the URL of the page
function addToSession(userData, movementFlag = null, URL = null) {
    const addToSessionURL = "./includes/addToSession.inc.php"
    $.post(addToSessionURL, userData, function() {  //added userData successfully
        if(movementFlag === 'redirectTo') {window.location.replace(URL)}  //redirect to URL/don't add to history
        else if(movementFlag === 'goTo') {window.location.href = URL}   //go to URL, adding past location to history
        //else, movementFlag === null: stay on current page
    })
    .fail(function(data){  //failed to connect
        console.log("Error! " + data)
    })
}

function logout(){
    const addToSessionURL = "./includes/addToSession.inc.php"
    $.post(addToSessionURL, {logout : true}, function() {  //added userData successfully
        window.location.href = "./login.php"   //go to URL, adding past location to history
    })
    .fail(function(data){  //failed to connect
        console.log("Error! " + data)
    })
}

function switchtoClassroom(classID , className){
    let currentPage =  window.location.href;
    addToSession({classroomID: classID, classroomName: className}, 'redirectTo', currentPage);
}