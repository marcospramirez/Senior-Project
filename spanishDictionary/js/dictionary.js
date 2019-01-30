function updateHeader(dictionaryName) {
    $('#dictionary-header').val(`Dictionary: ${dictionaryName}`)
}

function showAddToDictionaryButton(dictionaryBody) {
    //if instructor, show button that allows them to add terms to the dictionary
    let addToDictionaryButton = `<button id="classroom-student-btn" class="col-sm-auto btn dark" onclick="window.location.href = './addDictionary.php'">Add to Dictionary</button>`
    dictionaryBody.append(addToDictionaryButton)
}//end of showAddToDictionaryButton

function hideTable(tableHtmlId, dictionaryBody) {
    $(`#${tableHtmlId}`).DataTable().destroy()  //make dataTable back to a normal table
    document.getElementById(tableHtmlId).style.display = "none" //hide normal table

    //show "no content in dictionary" message
    dictionaryBody.append("<h2 class='col'>No Content in Dictionary</h2>\n")
}

function playAudio(audioPath) {
    console.log(`audio/${audioPath}`)
    var audio = new Audio(`audio/${audioPath}`)
    audio.play()
}

//display audio, terms & definitions of the dictionary in a table
$ (function() {
    const tableHtmlId = 'table-dictionary'
    const dictionaryBody = $('#dictionary-body')
    const dictionaryID = dictionaryIDFromSession
    const dictionaryName = dictionaryNameFromSession
    const URL = `./services/dictionaryService.php?Action=single&dictionaryID=${dictionaryID}`
    updateHeader(dictionaryName)

    var table = $(`#${tableHtmlId}`).DataTable({
        "ajax": {
            url: URL,
            dataSrc: function (json) {
                if(json.length === 0) { //no terms in dictionary
                    hideTable(tableHtmlId,dictionaryBody)
                    if(roleFromSession == "instructor") {
                        showAddToDictionaryButton(dictionaryBody)
                    }
                } else {
                    var return_data = new Array();
                    for(var i=0;i< json.length; i++){
                        return_data.push([json[i].entryAudioPath, json[i].entryText, json[i].entryDefinition])
                    }
                    return return_data;
                }
            }
        },
        "columnDefs": [{
            "targets": 0,
            "data": null,
            "defaultContent": "<button class=\"btn btn-outline-success audio\"><i class=\"fas fa-volume-down\"></i></button>"
        }]
    });

    $(`#${tableHtmlId} tbody`).on( 'click', 'button', function () {
        var data = table.row( $(this).parents('tr') ).data();
        var audioPath = data[0];
        playAudio(audioPath)
    });
});
