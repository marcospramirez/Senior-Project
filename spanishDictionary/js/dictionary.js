let entryIDArray = []
function displayTable(dictionaryID, tableHtmlId, dictionaryBody) {
    const role = roleFromSession

    //initialize table
    const URL = `./services/dictionaryService.php?Action=single&dictionaryID=${dictionaryID}`
    let table = $(`#${tableHtmlId}`).DataTable({
        ajax: {
            url: URL,
            dataSrc: function (json) {
                if(json.length === 0) { //no terms in dictionary, hide content
                    hideTable(tableHtmlId,dictionaryBody)
                    // hideFilterTableButton()  //todo: implement this lol
                    if(role === "instructor") showAddToDictionaryButton(dictionaryBody, 'newDictionary')
                } else {
                    //allow instructor to add more terms to the dictionary
                    if(roleFromSession === 'instructor') showAddToDictionaryButton($('#add-more'), 'populatedDictionary')

                    let return_data = []
                    $.each(json, function (index, entry) {
                        return_data.push([entry.entryAudioPath, entry.entryText, entry.entryDefinition])
                        if(role === "instructor") {
                            entry.entryID = index   //todo marcos: add entryID to the return data, but only for instructors
                            entryIDArray.push(entry.entryID)
                        }
                    })
                    return return_data;
                }
            }
        },
        columns: getDictionaryColumnData(role)
    })
    setDictionaryButtonListeners(role, table, tableHtmlId)
}//end of displayTable

function getDictionaryColumnData(role) {
    let columnData = [{
        orderable: false,
        width: "5%",
        data: null,
        defaultContent: "<button class=\"btn btn-outline-success term audio\"><i class=\"fas fa-volume-down\"></i></button>"
        },
        {title: "Term"},
        {title: "Definition"}]

    if(role === "instructor") { //if instructor, allow user to edit and delete dictionary terms
        columnData.push({
                orderable: false,
                data: "edit",
                width: "5%",
                defaultContent: "<button class=\"btn btn-outline-info term edit\"><i class=\"fas fa-edit\"></i></button>"
            },
            {
                orderable: false,
                data: "delete",
                width: "5%",
                defaultContent: "<button class=\"btn btn-outline-danger term delete\"><i class=\"fas fa-trash\"></i></button>"
            })
    }
    return columnData
}//end of getDictionaryColumnData

function setDictionaryButtonListeners(role, table, tableHtmlId) {
    $(`#${tableHtmlId} tbody`).on( 'click', 'button.audio', function () {
        const audioPath = table.row($(this).parents('tr')).data()[0]
        playAudio(audioPath)
    })

    if(role === "instructor") {
        $(`#${tableHtmlId} tbody`).on( 'click', 'button.edit', function () {
            //grab entry text & definition and populate modal data with it.
            //once submit data for edit, send to server & once complete, show changes on table
            const row = table.row($(this).parents('tr'))
            const data = row.data()
            const entryID = entryIDArray[row.index()]
            const entryAudio = data[0]
            const entryText = data[1]
            const entryDefinition = data[2]
            const editModalID = 'edit-term'

            //SET MODAL DATA: maybe someday todo into it's own function
            //show entry data in edit form & show form/modal
            document.getElementById('entryText').value = entryText
            document.getElementById('entryDef').value = entryDefinition

            //use select2 to have dynamic tag selection for the current entry/term
            const tagSelectHTMLId = "#edit-tags"
            $(tagSelectHTMLId).select2({
                ajax: {
                    url: `services/dictionaryService.php?Action=singleTags?entryID=${entryID}`, //todo marcos: get tags for a specific entry
                    dataType: 'json'
                },
                placeholder: 'Tags',
                width: '100%'
            });
            //get unedited tags from select
            let selectData = $(tagSelectHTMLId).select2('data');
            const entryTagIDArray = parseSelectData(selectData).idArray

            $(`#${editModalID}`).modal('show')

            let editTermForm = document.forms.namedItem("editTermForm")
            editTermForm.addEventListener('submit', function(event) {
                event.preventDefault()

                const errorMsgId = 'edit-error-message'
                document.getElementById(errorMsgId).innerHTML = ''

                const newEntryText = document.getElementById('entryText').value
                const newEntryDefinition = document.getElementById('entryDef').value
                //get new tags from select
                selectData = $(tagSelectHTMLId).select2('data');
                const newEntryTagIDArray = parseSelectData(selectData).idArray
                const newEntryAudio = document.getElementById('entryAudio').value.split('\\').pop().split('/').pop()
                //^split & pop along filepath slashes (both Windows & Linux/Unix/Mac) to get filename from filepath:
                //split string along windows filepath slashes (\) & pop to get last array item (which should be the filename)
                //then, //split string along linux/unix/mac) filepath slashes (/) & pop to get last array item (which should be the filename).

                //check that the user actually changed the data
                if(dictionaryEntryChange(entryText, entryDefinition, entryTagIDArray, entryAudio, newEntryText, newEntryDefinition, newEntryTagIDArray, newEntryAudio)) {
                    let formData = new FormData(editTermForm)
                    formData.append("entryID", entryID)

                    const plainTextFormData = {entryAudioPath: newEntryAudio, entryText: newEntryText, entryDefinition: newEntryDefinition}
                    editEntry(table, row, formData, plainTextFormData, editModalID, errorMsgId)
                }else { //user didn't change term, show error message
                    document.getElementById(errorMsgId).innerHTML = 'Please edit the term or close the dialog box.'
                }
            })//end of form submit event listener
        })//end of button.edit onclick


        //delete button clicked: show modal to confirm delete. If confirmed,
        //delete entry in database and delete table row
        $(`#${tableHtmlId} tbody`).on( 'click', 'button.delete', function () {
            const row = table.row($(this).parents('tr'))
            const entryID = entryIDArray[row.index()]
            const entryText = row.data()[1]
            const deleteModalID = 'delete-term'

            document.getElementById('deleting-term').innerHTML = entryText
            $(`#${deleteModalID}`).modal('show')

            //user confirmed delete: delete entry
            $(`#submit-delete`).on( 'click', function () {
                deleteEntry(row, entryID, deleteModalID)
            })
        })
    }//end of setting listeners for instructor functions
}//end of setDictionaryButtonListeners

//make sure that the entry data has been changed, otherwise, don't submit
function dictionaryEntryChange(entryText, entryDefinition, entryTagIDArray, entryAudio, newEntryText, newEntryDefinition, newEntryTagIDArray, newEntryAudio) {
    if(entryText === newEntryText) return false
    else if(entryDefinition === newEntryDefinition) return false
    else if(areMatchingArrays(entryTagIDArray, newEntryTagIDArray)) return false
    else if(entryAudio === newEntryAudio || newEntryAudio === '') return false
    else return true
}//end of dictionaryEntryChange

function areMatchingArrays(array1, array2) {
    if(array1.length === array2.length) return false

    let matchingItems = 0
    $.each(array1, function(iArr1, valArr1) {
        $.each(array2, function (iArr2, valArr2) {
            if(valArr1 === valArr2) matchingItems++
        })
    })

    if(matchingItems === array1.length) return true
    else return false
}//end of areMatchingArrays

function editEntry(table, row, formData, plainTextFormData, editModalID, errorMsgId) {
    const URL = "./services/dictionaryService.php?Action=singleEdit"    //todo marcos: add action to dictService
    let xmlRequest = new XMLHttpRequest()
    xmlRequest.open("POST", URL)
    xmlRequest.onload = function() {
        let data = JSON.parse(xmlRequest.responseText)  //todo marcos: data = success message
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, edit row in table
                const newTermData = [plainTextFormData.entryAudioPath, plainTextFormData.entryText, plainTextFormData.entryDefinition]
                editTableRow(newTermData, table, row,editModalID)
            }} else {   //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }
    };
    xmlRequest.send(formData);
}//end of editEntry

//AJAX request to delete term at entryID. If success, remove row from table
function deleteEntry(row, entryID, deleteModalID) {
    const errorMsgId = 'delete-error-message'
    const URL = './services/dictionaryService.php?Action=singleDelete'  //todo marcos: add to dictService
    $.post(URL, {entry: entryID}, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, remove row from table
                entryIDArray.splice(row.index(), 1)  //remove remove entryID at index
                row.remove().draw(false) //remove row and redraw, but don't reset the table's page
                $(`#${deleteModalID}`).modal('hide') //hide modal to show table change
            }} else {   //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }
    })
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}//end of deleteEntry



function updateHeader(dictionaryName) {
    //update page title to reflect classroom name
    document.title = `${dictionaryName} Dictionary`

    $('#dictionary-header').append(dictionaryName)
}

//addDictionaryFlag === "newDictionary" or "populatedDictionary"
function showAddToDictionaryButton(html, addDictionaryFlag) {
    //add dictionaryFlag to the session but don't redirect anywhere
    addToSessionAndMoveToPage({addDictionaryFlag: addDictionaryFlag})
    //as instructor, show button that allows them to add terms to the dictionary
    let addToDictionaryButton = `<button class="col-sm-auto btn dark" onclick="window.location.href = './addDictionary.php'">Add to Dictionary</button>`
    html.append(addToDictionaryButton)
}//end of showAddToDictionaryButton

function hideTable(tableHtmlId, dictionaryBody) {
    $(`#${tableHtmlId}`).DataTable().destroy()  //make dataTable back to a normal table
    document.getElementById(tableHtmlId).style.display = "none" //hide normal table

    //show "no content in dictionary" message
    dictionaryBody.append("<h2 class='col'>No Content in Dictionary</h2>\n")
}

function playAudio(audioPath) {
    var audio = new Audio(`audio/${audioPath}`)
    audio.play()
}

//get tags, destroy current table and replace with table with filtered terms
function displayFilteredTable(tagSelectHTMLId, dictionaryID, tableHtmlId) {
    const role = roleFromSession
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
            document.getElementById(errorMsgId).innerHTML = 'Nope'  //todo: make better error message lol
        } else {    //found match(es)! show matching terms in table
            //parse data to display in new table
            let tableData = []
            $.each(data, function (index, entry) {
                tableData.push([entry.entryAudioPath, entry.entryText, entry.entryDefinition])
            })

            $('#filter-dictionary').modal('hide');  //hide modal
            //make dataTable back to a normal table
            $(`#${tableHtmlId}`).DataTable().clear().destroy()

            //show table with new data
            var table = $(`#${tableHtmlId}`).DataTable({
                data: tableData,
                columns: getDictionaryColumnData(role)
            });

            setDictionaryButtonListeners(role, table, tableHtmlId)
        }//end of else
    })
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}//end of displayFilteredTable

//parse select data into two arrays, tagIdArray & tagTextArray
function parseSelectData(selectData) {
    let tagIdArray = []
    let tagTextArray = []
    $.each(selectData, function(i, tagData) {
        tagIdArray.push(tagData.id)
        tagTextArray.push(tagData.text)
    })

    return {idArray: tagIdArray, textArray: tagTextArray}
}//end of parseSelectData


//todo:if ever the case that the user deletes all the terms, hide table & show addDictionaryButton

$ (function() {
    const tableHtmlId = 'table-dictionary'
    const dictionaryBody = $('#dictionary-body')
    const dictionaryID = dictionaryIDFromSession
    const dictionaryName = dictionaryNameFromSession

    updateHeader(dictionaryName)
    displayTable(dictionaryID, tableHtmlId, dictionaryBody)

    //use select2 to have dynamic tag selection
    const tagSelectHTMLId = "#tags-select"
    $(tagSelectHTMLId).select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags',
        width: '100%'
    });

    //todo: add button that clears filters/back to normal dictionary
    //essentially, clear.destroy table, then call displayTable again lol

    //hijack filter form to display filtered table
    let filterForm = $('#filter-dictionary-form')
    filterForm.submit(function (event) {
        event.preventDefault()

        displayFilteredTable(tagSelectHTMLId, dictionaryID, tableHtmlId)
    })
});//end of $(function()
