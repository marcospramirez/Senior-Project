let classroomCount = 1   //page loads with one term & need at least one term in a dictionary
function addClassroomField() {
    const classroomHTML = `<hr class="hr-entries">
            <div class="classroom-name"> <!--Classroom #${classroomCount + 1} for Instructor-->
                <div class="form-group"><input type="text" id="classroom${classroomCount + 1}" class="form-control" title="Enter Classroom Name" name="classroomName[]" placeholder="Classroom Name" required></div>
            </div>`

    $('#classrooms').append(classroomHTML)

    classroomCount++
}


$(function () {
    const email = emailFromSession

    const addClassroomForm = $('#add-classroom-hidden')
    addHiddenInputToForm(addClassroomForm, 'email', email)
})//end of doc ready