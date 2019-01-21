function getClassNameIdArray(data) {
    let classNameArray = []
    let classIdArray = []

    const classroomArray = stringToArray(data, "``");
    $.each(classroomArray, function (i, classroomString) {
        const classNameIdPair = stringToArray(classroomString, "||");

        const name = classNameIdPair[0]
        const id = classNameIdPair[1]

        classNameArray.push(name)
        classIdArray.push(id)
    })

    return {classNameArray: classNameArray, classIdArray: classIdArray}
}

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
    const URL = `./services/classroomService.php`
    const userData = {
        email: email
    }
    //using AJAX, recieves JSON from URL in the form of the data var
    $.get(URL, userData, function(data) {
        const classNameArray = getClassNameIdArray(data).classNameArray
        const classIdArray = getClassNameIdArray(data).classIdArray

        table = displayClassroomTable(classNameArray)

        $('#table-classrooms tbody').on('click', 'tr', function () {
            const tableIndex = table.row( this ).index()
            const classroomID = classIdArray[tableIndex]
            window.location.replace(`./dictionaries.html?classroom=${classroomID}&email=${email}`)
        } );
    })
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}) //end of doc ready