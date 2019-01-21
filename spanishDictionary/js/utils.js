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

function addHiddenClassIdInput(element, classID) {
    element.append(`<input type="hidden" name="class" value="${classID}">`)
}