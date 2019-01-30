function displayTable(dictionaryID, tableHtmlId, dictionaryBody) {
    const URL = `./services/dictionaryService.php?Action=single&dictionaryID=${dictionaryID}`
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
                    var return_data = []
                    $.each(json, function (index, entry) {
                        return_data.push([entry.entryAudioPath, entry.entryText, entry.entryDefinition])
                    })
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
}//end of displayTable



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

    updateHeader(dictionaryName)
    displayTable(dictionaryID, tableHtmlId, dictionaryBody)

    const tagSelectHTMLId = "#tags-select"
    $(tagSelectHTMLId).select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags',
        width: '100%'
    });

    let filterForm = $('#filter-dictionary-form')
    filterForm.submit(function (event) {
        event.preventDefault()

        //clear error messages
        errorMsgId = 'filter-error-message'
        document.getElementById(errorMsgId).innerHTML = ''

        //get tags from select
        const selectData = $(tagSelectHTMLId).select2('data');
        const tagData = parseSelectData(selectData)
        const tagIdArray = tagData.idArray
        // const tagTextArray = tagData.textArray

        //AJAX request term data that matches the selectData
        URL = './services/dictionaryService.php'
        const userData = {
            Action: 'filter',
            dictionary: dictionaryID,
            tags: tagIdArray
        }
        $.get(URL, userData, function(data) {
            data = JSON.parse(data)
            if(data.length === 0) { //no terms match filter
                document.getElementById(errorMsgId).innerHTML = 'Nope'
            } else {    //terms match!
                $('#filter-dictionary').modal('hide');  //hide modal

                //make dataTable back to a normal table
                $(`#${tableHtmlId}`).DataTable().clear()
                $(`#${tableHtmlId}`).DataTable().destroy()


                //show table with new data
                var table = $(`#${tableHtmlId}`).DataTable({
                    data: function () {
                        if(data.length === 0) { //no terms in dictionary
                            document.getElementById('filter-error-message').innerHTML = 'Nope'
                        } else {
                            var return_data = new Array();
                            $.each(json, function (index, entry) {
                                return_data.push([entry.entryAudioPath, entry.entryText, entry.entryDefinition])
                            })
                            return return_data;
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
            }//end of else
        })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
    })
});
