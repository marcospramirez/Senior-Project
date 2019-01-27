var studentCount = 1   //page loads with one term & need at least one term in a dictionary
function addStudentField() {
    const studentHTML = `<hr class="hr-entries">
            <div id="student${studentCount + 1}"> <!--Student #${studentCount + 1} in Classroom-->
                <div class="form-group"><input type="text" class="form-control" title="studentEmail" name="studentEmail[]" placeholder="Student Email" required></div>
            </div>`

    $('#students').append(studentHTML)

    studentCount++
}

function setAddStudentHeader(element, classroomName) {
    //update page title to reflect classroom name
    document.title = `${classroomName} - Add Students`
    //update header to reflect classroom name
    $(`#${element}`).append(classroomName)
}

$(function () {
    const classroomID = classroomIDFromSession
    const clasroomName = classroomNameFromSession

    setAddStudentHeader('add-students-header',clasroomName)

    //add classroomID as a hidden input named "class"
    //for both the 'import' form and the 'add student' form
    const importStudentForm = $('#import-hidden')
    addHiddenInputToForm(importStudentForm, 'class', classroomID)

    const addStudentForm = $('#add-students-hidden')
    addHiddenInputToForm(addStudentForm, 'class', classroomID)

    //todo: need to add a hidden input("Action": "addStudentsCSV" & "Action": "addStudents"),
    //but studentService.php expects them in GET, while I'm sending them through POST...
    //todo: "addStudents" vs "addStudent"?? Marcos has it like the prior in studentService.php
})