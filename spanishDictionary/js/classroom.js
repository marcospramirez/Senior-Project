function displayDictionaryTable(dictionaryArray, contentID) {
    let tableData = []

    $.each(dictionaryArray, function(i, dictionary) { tableData.push([dictionary]) })

    //display table data using DataTable
    let tableID = `#${contentID}`
    let table = $(tableID).DataTable( {
        data: tableData,
        columns: [{title: "Dictionaries"}]
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
        let btn = document.getElementById('set-btn')
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
                if (studentCount === 1) {     //count > 1, print "Student" (singular)
                    goToURL = "./studentList.php"
                    studentBtnInnerHTML = `${studentCount} Student`
                } else {    //count > 1, print "Students" (plural)
                    goToURL = "./studentList.php"
                    studentBtnInnerHTML = `${studentCount} Students`
                }
            }   //end of else if
            btn.innerHTML = `<a id="classroom-student-btn" class="col-sm-auto btn dark" href="${goToURL}">${studentBtnInnerHTML}</a>`
        }//end of else: received an student count number
    })//end of $.get
        .fail(function () {
            document.getElementById(errorMsgDiv).innerHTML += `Error, could not display student count! URL: ${URL}`
        })
}//end of showStudentCountButton

function showViewVocabListButton() {
    document.getElementById('set-btn').innerHTML = `<a id="classroom-student-btn" class="col-sm-auto btn dark" href="./vocabList.php">View Vocab List</a>`
}

//show "Add Dictionary" Button & add click event listener that takes user to addDictionary.php
function showAddDictionaryButton() {
    let addDictionaryButton = `<a id="add-dictionary" class="btn dark col-sm-auto" href="./addDictionary.php"><i class="fas fa-plus"></i> Add Dictionary</a>`
    $('#table-header').append(`            ${addDictionaryButton}\n`)    //extra spaces/tab for formatting purposes
}//end of showAddDictionaryButton

//get classroom's dictionary data (dictionaryID, dictionaryName) & display dictionary name in clickable table
//if dictionary name is clicked, go to view the dictionary (dictionary.php)
function showDictionaryTable(classroomID, classroomName, tableID) {
    const URL = './services/dictionaryService.php?Action=list'
    $.get(URL, {classroomID: classroomID}, function(data) {
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

function setAddDefaultDictionaryToClassroomDropdown() {
    const errorMsgId = 'add-default-dict-error-message'
    let select = $("#dictionary-select")
    const URL = './services/dictionaryService.php?Action=defaultList'
    $.get(URL, function(data) {
        //todo: customize this function to what I receive (do I get an success/error message? do i just get an array?)
        const dictionaryIDNameSet = getDictionaryIdNameSet(data)    //todo: how am I getting this data>
        if(dictionaryIDNameSet.dictionaryIdArray.length === 0) {  //no dictionaries received: error
            document.getElementById(errorMsgId).innerHTML = `Error, no dictionaries received! URL: ${URL}`
        } else {    //classroom has dictionaries, show dictionaries in dropdown
            const optionListHTML = getDictionaryOptions(dictionaryIDNameSet)
            select.append(optionListHTML)   //append html to select
            select.select2()    //initialize as select2 markup
        }
    })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}//end of setAddDefaultDictionaryToClassroomDropdown

function addDefaultDictionaryToClassroom(classroomID) {
    const errorMsgId = 'add-default-dict-error-message'
    const selectHTMLId = 'dictionary-select'
    let selectData = $(`#${selectHTMLId}`).select2('data')  //get data from select markup
    const dictionaryID = selectData[0].id
    const dictionaryName = selectData[0].text

    const URL = './services/dictionaryService.php?Action=singleAdd'
    const userData = {  //todo marcos
        dictionaryID: dictionaryID,
        classroomID: classroomID
    }
    $.post(URL, userData, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("message")) {
            //if post was successful, delete question from forum & show button to go to dictionary
            if(data.message === "success") {
                showGoToDictionaryBtn(dictionaryID, dictionaryName, `Term was added to ${dictionaryName}!`)
            }} else {   //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }
    })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}

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
        setAddDefaultDictionaryToClassroomDropdown(classroomID)
    }
    else showViewVocabListButton() //role === 'student

    showDictionaryTable(classroomID, classroomName, tableID)
}) //end of doc ready