function setStudentListHeader() {
    const classroomName = classroomNameFromSession
    //update title to reflect classroom name
    document.title = classroomName
    //update header to reflect classroom name
    document.getElementById('classroom-name').innerHTML = `Students in ${classroomName}`
}

function showAddStudentButton() {
    let addStudentBtnHTML = `<button id="add-student" class="col-sm-auto btn dark" onclick="window.location.href = './addStudent.php'"><i class="fas fa-plus"></i> Add Students</button>`
    $('#student-list-header').append(`            ${addStudentBtnHTML}\n`)    //extra spaces/tab for formatting purposes
}

function displayStudentListTable(studentList) {
    if(studentList.length == 0) {   //no students in classroom. redundant, but safe
        document.getElementById('table').innerHTML = `<h2>No Students in Classroom.</h2>`
    } else {//data in studentList
        //parse studentList into array usable for dataTable
        let tableDataSet = []
        $.each(studentList, function(index, studentInfo) {
            const studentName = studentInfo.name
            const studentEmail = studentInfo.email

            tableDataSet.push([studentName, studentEmail])
        })

        let columnSet = [
            {title: "Student Name"},
            {title: "Student Email"}
        ]

        //display table data using DataTable
        var table = $('#table-student-list').DataTable( {
            data: tableDataSet,
            columns: columnSet
        })
    }//end of else: data in studentList
}//end of displayClassroomTable

$(function () {
    const errorMsgId = 'table-classrooms'
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
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}) //end of doc ready