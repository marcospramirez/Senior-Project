function getDictionaryNameIdArray(data) {
    let dictionaryNameArray = []
    let dictionaryIdArray = []

    const dictionaryArray = stringToArray(data, "``");
    $.each(dictionaryArray, function (i, dictionaryString) {
        const dictionaryNameIdPair = stringToArray(dictionaryString, "||");

        const name = dictionaryNameIdPair[0]
        const id = dictionaryNameIdPair[1]

        dictionaryNameArray.push(name)
        dictionaryIdArray.push(id)
    })

    return {dictionaryNameArray: dictionaryNameArray, dictionaryIdArray: dictionaryIdArray}
}

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
}//end of displaydictionaryTable

function updateHeader(classroomID, contentID) {
    const URL = `./services/classroomService.php`
    const userData = {
        classID: classroomID
    }
    $.get(URL, userData, function(className) {
        //update title to reflect classroom name
        document.title = className
        //update header to reflect classroom name
        $('#classroom-header').append(className)


    })
    .fail(function() {
        document.getElementById(contentID).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}

function updateStudentButton(classroomID, contentID) {
    const URL = `./services/dictionaries.php`
    const userData = {
        role: "instructor",
        classroomID: classroomID
    }
    $.get(URL, userData, function(data) {
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

    updateHeader(classroomID, contentID);
    updateStudentButton(classroomID, contentID)


    const URL = './services/dictionaries.php';
    const userData = {
        email: email,
        role : "instructor"
    }
    //using AJAX, recieves JSON from URL in the form of the data var
    $.get(URL, userData, function(data) {
        //maybe make data include the dictionary ID and somehow send that to dictionary.html
        const dictionaryNameArray = getDictionaryNameIdArray(data).dictionaryNameArray
        const dictionaryIdArray = getDictionaryNameIdArray(data).dictionaryIdArray
        table = displayDictionaryTable(dictionaryNameArray, contentID)

        $(`#${contentID} tbody`).on('click', 'tr', function () {
            const tableIndex = table.row( this ).index()
            const dictionaryID = dictionaryIdArray[tableIndex]

            window.location.replace(`./dictionary.html?email=${email}&dictionaryID=${dictionaryID}`)
        } );
    })
    .fail(function() {
        document.getElementById(contentID).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}) //end of doc ready