function updateHeader(dictionaryName) {
    $('#dictionary-header').val(`Dictionary: ${dictionaryName}`)
}

function showAddToDictionaryButton() {
    var dictionaryBody = $('#dictionary-body')
    //remove table
    $('#table-dictionary').remove()

    //show "no content in dictionary" message
    dictionaryBody.append("<h2>No Content in Dictionary</h2>\n")
    //if instructor, show button that allows them to add terms to the dictionary
    if(userTypeFromSession == "instructor") {
        let addToDictionaryButton = '<button id="classroom-student-btn" class="col-sm-auto btn dark">Add to Dictionary</button>'
        dictionaryBody.append(addToDictionaryButton)

        addToDictionaryButton.click(function () {
            window.location.href = './TBD.php'  //todo: figure out if this is going to addDictionary.php or a new editDictionary.php
        })
    }
}//end of showAddToDictionaryButton

function playAudio(audioPath) {
    console.log(`audio/${audioPath}`)
    var audio = new Audio(`audio/${audioPath}`)
    audio.play()
}

//display audio, terms & definitions of the dictionary in a table
$ (function() {
    const URL = `./services/dictionaryService.php`
    // const dictionaryID = dictionaryIDFromSession
    const dictionaryName = dictionaryNameFromSession
    updateHeader(dictionaryName)

    var table = $('#table-dictionary').DataTable({
        "ajax": {
            url: URL,
            dataSrc: function (json) {  //todo: figure out how this works and how I can add an "Action": "single" to the data
                if(json.length === 0) { //no terms in dictionary
                    showAddToDictionaryButton()
                } else {
                    var return_data = new Array();
                    for(var i=0;i< json.length; i++){
                        return_data.push(["audio", json[i].entryText, json[i].entryDefinition])
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

    $('#table-dictionary tbody').on( 'click', 'button', function () {
        var data = table.row( $(this).parents('tr') ).data();
        var audioPath = data[0];
        playAudio(audioPath)
    });
});
