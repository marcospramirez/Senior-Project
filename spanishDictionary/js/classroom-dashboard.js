function displayClassroomTable(classroomArray) {
    let tableDataSet = []
    $.each(classroomArray, function(i, classroom) {
        let tableDataRow = [classroom]
        tableDataSet.push(tableDataRow)
    })

    let columnSet = [
        {title: "Classroom Name"}
    ]

    //display table data using DataTable
    var table = $('#table-classrooms').DataTable( {
        data: tableDataSet,
        columns: columnSet
    })

    return table
}//end of displayClassroomTable

function stringToClassroomNameArray(string) {
    array = string.split("||")
    array.pop();//remove last entry, which is an empty entry
    return array
}

$(function () {
    let table = ''
    const errorMsgId = 'table-classrooms'
    let urlParams = parseURLParams(location.href)
    if(urlParams.length == 0 || !urlParams.hasOwnProperty("email")) {
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

    let email = urlParams.email[0]
    const URL = `./services/classroom.php`
    const userData = {
        email: email
    }
    //using AJAX, recieves JSON from URL in the form of the data var
    $.get(URL, userData, function(data) {
        let array = stringToClassroomNameArray(data)
        table = displayClassroomTable(array)

        $('#table-classrooms tbody').on('click', 'tr', function () {
            var classroomName = table.row( this ).data();
            window.location.replace(`./student-classroom.html?classroomName=${classroomName}`)
        } );
    })
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}) //end of doc ready