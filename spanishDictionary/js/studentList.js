function setStudentListHeader() {
    const classroomName = classroomNameFromSession
    //update title to reflect classroom name
    document.title = classroomName
    //update header to reflect classroom name
    $(`#classroom-name`).append(classroomName)
}

function showAddStudentButton() {
    let addStudentButton = '<button id="add-student" class="col-sm-auto btn dark"><i class="fas fa-plus"></i> Add Students</button>'

    $('#student-list-header').append(`            ${addStudentButton}\n`)    //extra spaces/tab for formatting purposes

    addStudentButton.click(function () {
        window.location.href = '../addStudent.php'
    })
}

function displayStudentListTable(studentList) {
    // let tableDataSet = []
    // $.each(classroomArray, function(i, classroom) {
    //     let tableDataRow = [classroom]
    //     tableDataSet.push(tableDataRow)
    // })

    let columnSet = [
        {title: "Student Name"},
        {title: "Student Email"}
    ]

    //display table data using DataTable
    var table = $('#table-student-list').DataTable( {
        data: studentList,
        columns: columnSet
    })
}//end of displayClassroomTable

$(function () {
    const errorMsgId = 'table-classrooms'
    let classroomID = classroomIDFromSession

    setStudentListHeader()

    const userType = userTypeFromSession
    if(userType === 'instructor') {
        showAddStudentButton()
    }

    //get list of students in the classroom and display them in a table
    const URL = `./services/studentService.php`
    const userData = {
        Action: "list",
        classroomID: classroomID
    }
    //using AJAX, recieves JSON from URL in the form of the data var
    $.get(URL, userData, function(data) {
        let studentList = JSON.parse(data)
        displayStudentListTable(studentList)
    })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}) //end of doc ready