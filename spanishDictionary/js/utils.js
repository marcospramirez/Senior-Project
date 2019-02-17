function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}//end of parseURLParams

function stringToArray(string, delimiter) {
    array = string.split(delimiter)
    if(array[array.length-1] === "") {    //if last index is empty, pop it
        array.pop();
    }
    return array
}

function addHiddenInputToForm(form, name, data) {
    form.append(`<input type="hidden" name="${name}" value="${data}">`)
}

//add user data to session and then move to a different file.
//movementFlag: "redirectTo"- move to different file without adding the movement to the history stack
//              "goTo"- move to a different file, adding the movement to the history stack
function addToSessionAndMoveToPage(userData, movementFlag = null, URL = null) {
    const addToSessionURL = "./includes/addToSession.inc.php"
    $.post(addToSessionURL, userData, function() {  //added userData successfully
        if(movementFlag === 'redirectTo') {window.location.replace(URL)}  //redirect to URL/don't add to history
        else if(movementFlag === 'goTo') {window.location.href = URL}   //go to URL, adding past location to history
        //else, don't move page
    })
    .fail(function(data){  //failed to connect
        console.log("Error! " + data)
    })
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