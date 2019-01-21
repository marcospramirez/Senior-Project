var studentCount = 1   //page loads with one term & need at least one term in a dictionary
function addStudentField() {
    const studentHTML = `<hr class="hr-entries">
            <div id="student${studentCount + 1}"> <!--Student #${studentCount + 1} in Classroom-->
                <div class="form-group"><input type="text" class="form-control" title="studentEmail" name="studentEmail[]" placeholder="Student Email" required></div>
            </div>`

    $('#students').append(studentHTML)

    studentCount++
}

function setAddStudentHeader(element, classID, errorMsg) {
    const URL = `./services/classroomService.php`
    const userData = {
        classID: classID
    }
    $.get(URL, userData, function(className) {
        //update title to reflect classroom name
        document.title = `${className} - Add Students`
        //update header to reflect classroom name
        $(`#${element}`).append(className)
    })
    .fail(function() {
        document.getElementById(errorMsg).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}

$(function () {
    let urlParams = parseURLParams(location.href)
    const classID = urlParams.classID[0]

    const hiddenImport = $('#import-hidden')
    addHiddenClassIdInput(hiddenImport, classID)

    const hiddenAddToDictionary = $('#add-students-hidden')
    addHiddenClassIdInput(hiddenAddToDictionary, classID)

    let errorMsg = $('#add-students-error-message')

    setAddStudentHeader('add-students-header',classID, errorMsg)
})