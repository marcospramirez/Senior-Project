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
function addToSessionAndMoveToPage(userData, movementFlag, URL) {
    const addToSessionURL = "./includes/addToSession.inc.php"
    $.post(addToSessionURL, userData, function() {  //added userData successfully
        if(movementFlag === 'redirectTo') {window.location.replace(URL)}  //redirect to URL/don't add to history
        else if(movementFlag === 'goTo') {window.location.href = URL}   //go to ULR, adding past location to history
    })
    .fail(function(data){  //failed to connect
        console.log("Error! " + data)
    })
}

function logout(){
    const addToSessionURL = "./includes/addToSession.inc.php"
    $.post(addToSessionURL, {logout : true}, function() {  //added userData successfully
        window.location.href = "./login.php"   //go to ULR, adding past location to history
    })
    .fail(function(data){  //failed to connect
        console.log("Error! " + data)
    })
}

function switchtoClassroom(classID , className){
    let currentPage =  window.location.href;
    addToSessionAndMoveToPage({classroomID: classID, classroomName: className}, 'redirectTo', currentPage);
}