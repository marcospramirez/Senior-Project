function addHiddenInputToForm(form, name, data) {
    form.append(`<input type="hidden" name="${name}" value="${data}">`)
}

//add user data to session and then move to a different file.
//movementFlag: "redirectTo"- move to different file without adding the movement to the history stack
//              "goTo"- move to a different file, adding the movement to the history stack
//              null - add data to the session and stay on current page (don't move)
function addToSession(userData, movementFlag = null, URL = null) {
    const addToSessionURL = "./includes/addToSession.inc.php"
    $.post(addToSessionURL, userData, function() {  //added userData successfully
        if(movementFlag === 'redirectTo') {window.location.replace(URL)}  //redirect to URL/don't add to history
        else if(movementFlag === 'goTo') {window.location.href = URL}   //go to URL, adding past location to history
        //else, stay on current page
    })
    .fail(function(data){  //failed to connect
        console.log("Error! " + data)
    })
}

function logout(){
    const addToSessionURL = "./includes/addToSession.inc.php"
    $.post(addToSessionURL, {logout : true}, function() {  //added userData successfully
        window.location.href = "./login.php"   //go to URL, adding past location to history
    })
    .fail(function(data){  //failed to connect
        console.log("Error! " + data)
    })
}

function switchtoClassroom(classID , className){
    let currentPage =  window.location.href;
    addToSession({classroomID: classID, classroomName: className}, 'redirectTo', currentPage);
}

//in order to edit table at specific row index, redraw whole table with new entry data
function editTableRow(data, table, row, editModalID) {
    const index = row.index()
    row.remove()    //delete old row
    let currentRows = table.data().toArray()  //get table data
    currentRows.splice(index, 0, data)   //add new data to table data
    table.clear()   //empty the table
    table.rows.add(currentRows).draw() //redraw table with edited term in correct row index
    let rowNode = table.row(index).node()
    $(`#${editModalID}`).modal('hide') //hide modal to show table change
    animateRowBackground(rowNode) //animate added row to emphasize change
}//end of editTableRow

//animate background color of added row to pulse
function animateRowBackground(rowNode) {
    const normalBG = {color: '#343434', backgroundColor: 'transparent'}
    const darkBG = {color: 'white', backgroundColor: '#172b42'}
    for(let i = 0; i < 3; i++) {    //pulse bg color 3 times
        $(rowNode).animate(darkBG, 'slow')
        $(rowNode).animate(normalBG, 'slow')
    }
    $(rowNode).animate(darkBG, 'slow')  //animate once more to darkBG color
    $(rowNode).delay(5*1000).animate(normalBG, 'slow')   //keep darkBG color for 15 seconds longer, then revert back
}//end of animateRowBackground