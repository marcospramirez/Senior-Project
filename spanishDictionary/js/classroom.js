function getDictionaryIdNameSet(data) {
    let dictionaryIDArray = []
    let dictionaryNameArray = []

    const dictionaryIDNameData = JSON.parse(data)

    $.each(dictionaryIDNameData, function (i, dictionaryNameID) {
        const dictionaryID = dictionaryNameID.dictionaryID
        const dictionaryName = dictionaryNameID.dictionaryName

        dictionaryIDArray.push(dictionaryID)
        dictionaryNameArray.push(dictionaryName)
    })

    return {dictionaryIdArray: dictionaryIDArray, dictionaryNameArray: dictionaryNameArray}
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

function updateHeader(classroomName) {
    $('#classroom-header').val(classroomName)
}

//if no students, button allows instructor to add students (addStudent.php).
//if students in classroom, button shows number of students in classroom
//when clicked, button redirects to table of students in the classroom (studentList.php).
function showStudentCountButton(classroomID, errorMsgDiv) {
    const URL = './services/studentService.php'
    const userData = {
        Action: "count",
        classroomID: classroomID
    }
    $.get(URL, userData, function (data) { //get student count of classroom
        //todo: Marcos, standardize your error message. Sometimes it's an key:value array, sometimes it's a string
        // if(data.hasOwnProperty(error)) {
        //     document.getElementById(errorMsgDiv).innerHTML += `Error, could not find classroom!`
        // }

        let classroomDiv = $('#classroom-div')
        let studentButton = '<button id="classroom-student-btn" class="col-sm-auto btn dark"></button>'
        classroomDiv.append(studentButton)
        let studentButtonInnerHTML = $('#classroom-student-btn')

        let studentCount = parseInt(data)   //convert string to int

        if (studentCount === 0) {    //if no students in classroom, allow instructor to add some
            studentButtonInnerHTML.append(`Add Students to Classroom`)
            studentButton.on( "click", function () {
                window.location.href = './addStudent.php'
            })
        }   //end of if
        //else if there are students in the classroom,
        //allow instructor to view student list
        else if (studentCount > 0) {    //show student count in button body
            studentButtonInnerHTML.append(`${studentCount} Student`)

            //if count > 1, make 'Student' plural ('Student' + 's')
            if (studentCount > 1) {
                studentButtonInnerHTML.append('s')
            }

            studentButton.on( "click", function () {
                window.location.href = './studentList.php'
            })
        }   //end of else if
    })//end of $.get
        .fail(function () {
            document.getElementById(errorMsgDiv).innerHTML += `Error, could not display student count! URL: ${URL}`
        })
}//end of showStudentCountButton

//show "Add Dictionary" Button & add click event listener that takes user to addDictionary.php
function showAddDictionaryButton() {
    let addDictionaryButton = '<button id="add-dictionary" class="btn dark col-sm-auto" onclick="window.location.href = \'./addDictionary.php\'"><i class="fas fa-plus"></i> Add Dictionary</button>'
    $('#table-header').append(`            ${addDictionaryButton}\n`)    //extra spaces/tab for formatting purposes
}//end of showAddDictionaryButton

//get classroom's dictionary data (dictionaryID, dictionaryName) & display dictionary name in clickable table
//if dictionary name is clicked, go to view the dictionary (dictionary.php)
function showDictionaryTable(classroomID, classroomName, tableID) {
    const URL = './services/dictionaryService.php'
    const userData = {
        Action: "list",
        classroomID: classroomID
    }
    $.get(URL, userData, function(data) {
        //separate dictionary data into separate arrays
        const dictionaryIDNameSet = getDictionaryIdNameSet(data)
        const dictionaryIDArray = dictionaryIDNameSet.dictionaryIdArray
        const dictionaryNameArray = dictionaryIDNameSet.dictionaryNameArray

        if(dictionaryNameArray.length === 0) {  //classroom doesn't have dictionaries
            $(`#table`).val(`No Dictionaries in Classroom ${classroomName}.`)
        } else {    //classroom has dictionaries
            let table = displayDictionaryTable(dictionaryNameArray, tableID)

            //click on table row/dictionary name to go to dictionary
            $(`#${tableID} tbody`).on('click', 'tr', function () {
                const tableIndex = table.row( this ).index()
                const dictionaryID = dictionaryIDArray[tableIndex]
                const dictionaryName = dictionaryNameArray[tableIndex]

                //add email and role to the session & redirect to the dashboard
                addToSessionAndMoveToPage({dictionaryID: dictionaryID, dictionaryName: dictionaryName}, 'goTo', './dictionary.php')
            } );
        }//end of else: classroom has dictionaries


    })
        .fail(function() {  //connection error
            document.getElementById(tableID).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}//end of showDictionaryTable

//show table of the classroom's dictionaries. When dictionary name is clicked, go to dictionary (dictionary.php)
//if user is instructor, allow user to view student count/add students & add a dictionary
$(function () {
    const tableID = 'table-dictionaries'
    // let email = emailFromSession
    const role = roleFromSession
    const classroomID = classroomIDFromSession
    const classroomName = classroomNameFromSession

    //todo: error checking data that comes from session, specifically, catching empty or undefined variables

    updateHeader(classroomName)

    if(role === 'instructor') {
        showStudentCountButton(classroomID, tableID)
        showAddDictionaryButton()
    }

    showDictionaryTable(classroomID, classroomName, tableID)
}) //end of doc ready