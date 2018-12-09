function importDictionary(classID, errormsg) {
    const URL = `./services/addDictionary.php?class=${classID}`
    const dictionaryName= $('#dictionary-name').val()
    const userData = {
        submit_csv: true    //how the fuck am i supposed to import a file????
    }
    //using AJAX, recieve dictionaryID of new dictionary
    $.post(URL, userData, function(data) {
        const dictionaryID = data
        let terms = getTerms()

        insertTerms(dictionaryID, terms)
    })
        .fail(function() {
            errormsg.append(`Error, could not connect! URL: ${URL}`)
        })
}

$(function () {
    //set form variable
    let form = $('#import-dictionary-form')

    //"hijack" form submit button
    form.submit(function (event) {
        event.preventDefault()  //prevent default form action

        console.log("YOINK!")

        let urlParams = parseURLParams(location.href)
        const classID = urlParams.classID[0]

        //clear error messages
        const errormsg = $('#import-error-message')
        errormsg.empty()

        importDictionary(classID, errormsg)
    })
})