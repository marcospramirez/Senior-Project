function displayDictionaryTable(dictionaryArray, contentID) {
    let tableDataSet = []
    $.each(dictionaryArray, function(i, dictionary) {
        let tableDataRow = [dictionary]
        tableDataSet.push(tableDataRow)
    })

    let columnSet = [
        {title: "Dictionaries"}
    ]

    //display table data using DataTable
    var tableID = `#${contentID}`
    var table = $(tableID).DataTable( {
        data: tableDataSet,
        columns: columnSet
    })

    return table
}//end of displayClassroomTable

function updateHeader(classroomID) {
    //update title to reflect classroom name
    document.title = classroomID
    //update header to reflect classroom name
    $('#classroom-header').append(classroomID)
}

function updateStudentButton(classroomID, contentID) {
    const URL = `./services/dictionaries.php?classroomID=${classroomID}`
    //using AJAX, recieves JSON from URL in the form of the data var
    $.get(URL, {}, function(data) {
        let studentButton = $('#classroom-student')
        studentButton.append(`${data} Students`)

        studentButton.click(function () {
            window.location.replace(`./students.html?classroom=${classroomID}`)
        })


    })
    .fail(function() {
        document.getElementById(contentID).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}

$(function () {


    let table = ''
    const contentID = 'table-dictionaries'
    let urlParams = parseURLParams(location.href)
    if(urlParams.length == 0 || !urlParams.hasOwnProperty("email")) {
        try {
            document.getElementById(contentID).innerHTML = `Error, no email received!`
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
    let classroomID = urlParams.classroom[0]

    updateHeader(classroomID);
    updateStudentButton(classroomID)


    const URL = `./services/dictionaries.php?email=${email}`
    const userData = {
        email: email
    }
    //using AJAX, recieves JSON from URL in the form of the data var
    $.get(URL, userData, function(data) {
        //maybe make data include the dictionary ID and somehow send that to dictionary.html
        let array = stringToArray(data)
        table = displayDictionaryTable(array, contentID)

        $(`#${contentID} tbody`).on('click', 'tr', function () {
            var dictionaryName = table.row( this ).data();

            window.location.replace(`./dictionary.html?email=${email}&dictionaryName=${dictionaryName}`)
        } );
    })
    .fail(function() {
        document.getElementById(contentID).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}) //end of doc ready