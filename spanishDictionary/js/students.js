function setStudentsHeader(element, classID, errorMsg) {
    const URL = `./services/classroomService.php`
    const userData = {
        classID: classID
    }
    $.get(URL, userData, function(className) {
        //update title to reflect classroom name
        document.title = className
        //update header to reflect classroom name
        $(`#${element}`).append(className)
    })
        .fail(function() {
            document.getElementById(errorMsg).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}

function displayStudentListTable(studentListArray) {
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
    var table = $('#table-students').DataTable( {
        data: studentListArray,
        columns: columnSet
    })

    return table
}//end of displayClassroomTable

function stringToStudentArray(string) {
    nameEmailPairArray = string.split("||")
    nameEmailPairArray.pop();//remove last entry, which is an empty entry

    studentArray = []

    $.each(nameEmailPairArray, function (i, nameEmailPair) {
        studentArray.push(nameEmailPair.split("//"))
    })

    return studentArray
}

$(function () {
    const errorMsgId = 'table-classrooms'
    let urlParams = parseURLParams(location.href)
    if(urlParams.length == 0 || !urlParams.hasOwnProperty("classroomID")) {
        try {
            document.getElementById(errorMsgId).innerHTML = `Error, no email received!`
        }
        catch(e) {    //if can't display error in div, do it in console
            if (e instanceof TypeError) {
                console.log("Not running html! Are you Testing?")
            }
            else {
                console.log("Error!! " + location.href)
            }
        }
    }

    let classroomID = urlParams.classroomID[0]

    setStudentsHeader('classroom-name', classroomID, errorMsgId)

    const URL = `./services/studentService.php`
    const userData = {
        classID: classroomID
    }
    //using AJAX, recieves JSON from URL in the form of the data var
    $.get(URL, userData, function(data) {
        let array = stringToStudentArray(data)
        displayStudentListTable(array)
    })
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}) //end of doc ready