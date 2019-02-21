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
    //update title to reflect classroom name
    document.title = classroomName
    //update header to reflect classroom name
    document.getElementById('classroom-header').innerHTML = classroomName
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
        let classroomDiv = $('#classroom-div')
        const studentCount = parseInt(data)   //convert string to int
        if(isNaN(studentCount)) {
            document.getElementById(errorMsgDiv).innerHTML += `Error, could not find classroom!`
        } else {    //received an student count number
            let goToURL = ''
            let studentBtnInnerHTML = ''

            //if no students in classroom, allow instructor to add some
            if (studentCount === 0) {
                goToURL = "./addStudent.php"
                studentBtnInnerHTML = '<i class="fas fa-plus"></i>Add Students'
            }

            //else if there are students in the classroom, allow instructor to view student list
            else if (studentCount > 0) {    //show student count in button body
                if (studentCount == 1) {     //count > 1, print "Student" (singular)
                    goToURL = "./studentList.php"
                    studentBtnInnerHTML = `${studentCount} Student`
                } else {    //count > 1, print "Students" (plural)
                    goToURL = "./studentList.php"
                    studentBtnInnerHTML = `${studentCount} Students`
                }
            }   //end of else if

            let studentBtnHTML = `<a id="classroom-student-btn" class="col-sm-auto btn dark" href="${goToURL}">${studentBtnInnerHTML}</a>`
            classroomDiv.append(studentBtnHTML)
        }//end of else: received an student count number
    })//end of $.get
        .fail(function () {
            document.getElementById(errorMsgDiv).innerHTML += `Error, could not display student count! URL: ${URL}`
        })
}//end of showStudentCountButton

//show "Add Dictionary" Button & add click event listener that takes user to addDictionary.php
function showAddDictionaryButton() {
    let addDictionaryButton = `<a id="add-dictionary" class="btn dark col-sm-auto" href="./addDictionary.php"><i class="fas fa-plus"></i> Add Dictionary</a>`
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
            document.getElementById('table').innerHTML = `<h2>No Dictionaries in Classroom ${classroomName}.</h2>`
        } else {    //classroom has dictionaries
            let table = displayDictionaryTable(dictionaryNameArray, tableID)

            //click on table row/dictionary name to go to dictionary
            $(`#${tableID} tbody`).on('click', 'tr', function () {
                const tableIndex = table.row( this ).index()
                const dictionaryID = dictionaryIDArray[tableIndex]
                const dictionaryName = dictionaryNameArray[tableIndex]

                //add email and role to the session & redirect to the dashboard
                addToSession({dictionaryID: dictionaryID, dictionaryName: dictionaryName}, 'goTo', './dictionary.php')
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

    updateHeader(classroomName)

    if(role === 'instructor') {
        showStudentCountButton(classroomID, tableID)
        showAddDictionaryButton()
    }

    showDictionaryTable(classroomID, classroomName, tableID)
}) //end of doc ready