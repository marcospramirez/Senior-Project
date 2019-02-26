function setStudentListHeader() {
    const classroomName = classroomNameFromSession
    //update title to reflect classroom name
    document.title = classroomName
    //update header to reflect classroom name
    document.getElementById('classroom-name').innerHTML = `<h1>Students in ${classroomName}</h1>`
}

function showAddStudentButton() {
    let addStudentBtnHTML = `<a id="add-student" class="col-sm-auto btn dark" href="./addStudent.php"><i class="fas fa-plus"></i> Add Students</a>`
    $('#student-list-header').append(`            ${addStudentBtnHTML}\n`)    //extra spaces/tab for formatting purposes
}

function displayStudentListTable(studentList) {
    if(studentList.length === 0) {   //no students in classroom. redundant, but safe
        document.getElementById('table').innerHTML = `<h2>No Students in Classroom.</h2>`
    } else {//data in studentList
        const tableHtmlId = 'table-student-list'
        const role = roleFromSession
        //parse studentList into array usable for dataTable
        let tableDataSet = []
        $.each(studentList, function(index, studentInfo) {
            const studentName = studentInfo.name
            const studentEmail = studentInfo.email

            tableDataSet.push([studentName, studentEmail])
        })

        //display table data using DataTable
        var table = $(`#${tableHtmlId}`).DataTable( {
            data: tableDataSet,
            columns: getStudentColumnData(role)
        })
        setStudentButtonListeners(tableDataSet, role, table, tableHtmlId)
    }//end of else: data in studentList
}//end of displayClassroomTable

function getStudentColumnData(role) {
    let columnData = [
        {title: "Student Name"},
        {title: "Student Email"}]

    if(role === "instructor") { //if instructor, allow user to edit and delete student details
        columnData.push(
            // {
            //     orderable: false,
            //     data: "edit",
            //     width: "5%",
            //     defaultContent: "<button class=\"btn btn-outline-info student edit\"><i class=\"fas fa-edit\"></i></button>"
            // },
            {
                orderable: false,
                data: "delete",
                width: "5%",
                defaultContent: "<button class=\"btn btn-outline-danger student delete\"><i class=\"fas fa-trash\"></i></button>"
            })
    }
    return columnData
}//end of getStudentColumnData

function setStudentButtonListeners(tableDataSet, role, table, tableHtmlId) {
    /*
    $(`#${tableHtmlId} tbody`).on( 'click', 'button.edit', function () {
        //grab entry text & definition and populate modal data with it.
        //once submit data for edit, send to server & once complete, show changes on table
        const row = table.row($(this).parents('tr'))
        const data = row.data()
        const tableSName = data[0]
        const tableSEmail = data[1]
        const editModalID = 'edit-student'

        //show student data in edit form & show form/modal
        document.getElementById('studentName').value = tableSName
        document.getElementById('studentEmail').value = tableSEmail

        $(`#${editModalID}`).modal('show')

        let editTermForm = document.forms.namedItem("editStudentForm")
        editTermForm.addEventListener('submit', function(event) {
            event.preventDefault()

            const errorMsgId = 'edit-error-message'
            document.getElementById(errorMsgId).innerHTML = ''

            const newStudentName = document.getElementById('studentName').value
            const newStudentEmail = document.getElementById('studentEmail').value

            //check that the user actually changed the data
            if(studentChange(tableSName, tableSEmail, newStudentName, newStudentEmail)) {
                let formData = new FormData(editTermForm)
                const plainTextFormData = {studentEmail: newStudentEmail, studentName: newStudentName}
                editStudent(table, row, formData, plainTextFormData, editModalID, errorMsgId)
            } else { //user didn't change student data, show error message
                document.getElementById(errorMsgId).innerHTML = 'Please edit the term or close the dialog box.'
            }
        })//end of form submit event listener
    })//end of button.edit onclick
    */

    //delete button clicked: show modal to confirm delete. If confirmed,
    //delete student in database and delete table row
    $(`#${tableHtmlId} tbody`).on( 'click', 'button.delete', function () {
        const row = table.row($(this).parents('tr'))
        const studentName = row.data()[0]
        const studentEmail = row.data()[1]
        const deleteModalID = 'delete-student'

        document.getElementById('deleting-student').innerHTML = studentName
        $(`#${deleteModalID}`).modal('show')

        //user confirmed delete: delete entry
        $(`#submit-delete`).on( 'click', function () {
            deleteStudent(row, classroomIDFromSession, studentEmail, deleteModalID)
        })
    })
}//end of setStudentButtonListeners

function studentChange(tableSName, tableSEmail, newStudentName, newStudentEmail) {
    if(tableSName === newStudentName) return false
    else if(tableSEmail === newStudentEmail) return false
    else return true
}//end of studentChange

function editStudent(table, row, formData, plainTextFormData, editModalID, errorMsgId) {
    const URL = "./services/studentService.php?Action=singleEdit"
    let xmlRequest = new XMLHttpRequest()
    xmlRequest.open("POST", URL)
    xmlRequest.onload = function() {
        let data = JSON.parse(xmlRequest.responseText)
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, edit row in table
                const newStudentData = [plainTextFormData.studentEmail, plainTextFormData.studentName]
                editTableRow(newStudentData, table, row, editModalID)
            }} else {   //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }
    };
    xmlRequest.send(formData);
}//end of editStudent

//AJAX request to delete term at studentEmail. If success, remove row from table
function deleteStudent(row, classroomID, studentEmail, deleteModalID) {
    const errorMsgId = 'delete-error-message'
    const URL = './services/studentService.php?Action=singleDelete'
    const userData = {
        class: classroomID,
        studentEmail: studentEmail
    }
    $.post(URL, userData, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, remove row from table
                row.remove().draw(false) //remove row and redraw, but don't reset the table's page
                $(`#${deleteModalID}`).modal('hide') //hide modal to show table change
            }} else {   //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }
    })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}//end of deleteStudent

$(function () {
    const errorMsgID = 'table-classrooms'
    let classroomID = classroomIDFromSession

    setStudentListHeader()

    const role = roleFromSession
    if(role === 'instructor') {
        showAddStudentButton()
    }

    //get list of students in the classroom and display them in a table
    const URL = `./services/studentService.php`
    const userData = {
        Action: "list",
        classroomID: classroomID
    }
    //using AJAX, receives JSON from URL in the form of the data var
    $.get(URL, userData, function(data) {
        let studentList = JSON.parse(data)
        displayStudentListTable(studentList)
    })
        .fail(function() {
            document.getElementById(errorMsgID).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}) //end of doc ready