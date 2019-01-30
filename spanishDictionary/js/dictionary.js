function updateHeader(dictionaryName) {
    //update page title to reflect classroom name
    document.title = `${dictionaryName} Dictionary`

    $('#dictionary-header').append(dictionaryName)
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

function hideFilterTableButton() {
    //todo: fill this out lol
}

function playAudio(audioPath) {
    console.log(`audio/${audioPath}`)
    var audio = new Audio(`audio/${audioPath}`)
    audio.play()
}

//parse select data into two arrays, tagIdArray & tagTextArray
function parseSelectData(selectData) {
    let tagIdArray = []
    let tagTextArray = []
    $.each(selectData, function(i, tagData) {
        tagIdArray.push(tagData.id)
        tagTextArray.push(tagData.text)
    })

    return {idArray: tagIdArray, textArray: tagTextArray}
}

//display audio, terms & definitions of the dictionary in a table
$ (function() {
    const tableHtmlId = 'table-dictionary'
    const dictionaryBody = $('#dictionary-body')
    const dictionaryID = dictionaryIDFromSession
    const dictionaryName = dictionaryNameFromSession
    let URL = `./services/dictionaryService.php?Action=single&dictionaryID=${dictionaryID}`
    updateHeader(dictionaryName)

    var table = $(`#${tableHtmlId}`).DataTable({
        "ajax": {
            url: URL,
            dataSrc: function (json) {
                if(json.length === 0) { //no terms in dictionary
                    hideTable(tableHtmlId,dictionaryBody)
                    hideFilterTableButton()
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


    $("#tags-select").select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags'
    });

    let filterForm = $('#filter-dictionary-form')

    filterForm.submit(function (event) {
        event.preventDefault()

        URL = './services/dictionaryService.php'

        //get tags from select
        const selectData = $('#tags-select').select2('data');
        const tagData = parseSelectData(selectData)
        const tagIdArray = tagData.idArray
        // const tagTextArray = tagData.textArray
        console.log(selectData)

        const userData = {
            Action: 'filter',
            dictionary: dictionaryID,
            tags: tagIdArray
        }

        //AJAX request term data that matches the selectData
        $.get(URL, userData, function(data) {
            console.log(data)

            $(`#${tableHtmlId}`).DataTable().destroy()  //make dataTable back to a normal table

            var table = $(`#${tableHtmlId}`).DataTable({
                data: data,
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

        })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
    })
});
