let entryIDArray = []
function displayDictionaryTable(dictionaryID, tableHtmlId) {
    const role = roleFromSession

    //initialize table
    const URL = `./services/dictionaryService.php?Action=single&dictionaryID=${dictionaryID}`
    let table = $(`#${tableHtmlId}`).DataTable({
        ajax: {
            url: URL,
            dataSrc: function (json) {
                if(json.length === 0) setEmptyDictVocabView(roleFromSession, tableHtmlId) //no terms in dictionary, hide content
                else {
                    //allow instructor to add more terms to the dictionary
                    if(role === 'instructor') showAddToDictionaryButton('add-more', 'populatedDictionary')

                    let return_data = []
                    $.each(json, function (index, entry) {
                        return_data.push([entry.entryAudioPath, entry.entryText, entry.entryDefinition])
                        if(role === "instructor") entryIDArray.push(entry.entryID)
                    })
                    return return_data;
                }
            }
        },
        columns: getDictionaryColumnData(role)
    })
    setDictionaryButtonListeners(role, tableHtmlId)
}//end of displayDictionaryTable

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

function setDictionaryButtonListeners(role, tableHtmlId) {
    $(`#${tableHtmlId} tbody`).on( 'click', 'button.audio', function () {
        const table = $(`#${tableHtmlId}`).DataTable()
        const audioPath = table.row($(this).parents('tr')).data()[0]
        playAudio(audioPath)
    })

    if(role === "instructor") {
        $(`#${tableHtmlId} tbody`).on( 'click', 'button.edit', function () {
            const table = $(`#${tableHtmlId}`).DataTable()
            const row = table.row($(this).parents('tr'))

            editDictionaryButtonClicked(tableHtmlId, row)
        })//end of button.edit onclick


        //delete button clicked: show modal to confirm delete. If confirmed,
        //delete entry in database and delete table row
        $(`#${tableHtmlId} tbody`).on( 'click', 'button.delete', function () {
            const table = $(`#${tableHtmlId}`).DataTable()
            const row = table.row($(this).parents('tr'))

            entryIDArray = deleteDictVocabButtonClicked(table, tableHtmlId, row, entryIDArray)
        })
    }//end of setting listeners for instructor functions
}//end of setDictionaryButtonListeners

//grab entry text & definition and populate modal data with it.
//once submit data for edit, send to server & once complete, show changes on table
function editDictionaryButtonClicked(tableHtmlId, row) {
    const data = row.data()
    const entryID = entryIDArray[row.index()]
    const entryAudio = data[0]
    const entryText = data[1]
    const entryDefinition = data[2]
    const editModalID = 'edit-term'
    const tagSelectHTMLId = 'edit-tags'

    setDictionaryModalData(tagSelectHTMLId, entryID, entryText, entryDefinition)
    $(`#${editModalID}`).modal('show')

    const entryTagIDArray = getTagData(tagSelectHTMLId).idArray //get unedited entry's tag id's

    let editTermForm = document.forms.namedItem("editTermForm")
    editTermForm.addEventListener('submit', function(event) {
        event.preventDefault()

        const errorMsgId = 'edit-error-message'
        document.getElementById(errorMsgId).innerHTML = ''

        const newEntryText = document.getElementById('entryText').value
        const newEntryDefinition = document.getElementById('entryDef').value
        //get new tags from select
        const newEntryTagIDArray = getTagData(tagSelectHTMLId).idArray
        const newEntryAudio = document.getElementById('entryAudio').value.split('\\').pop().split('/').pop()
        //^split & pop along filepath slashes (both Windows & Linux/Unix/Mac) to get filename from filepath:
        //split string along windows filepath slashes (\) & pop to get last array item (which should be the filename)
        //then, split string along linux/unix/mac) filepath slashes (/) & pop to get last array item (which should be the filename).

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
}//end of editDictionaryButtonClicked

//show entry data in edit form & return entry
function setDictionaryModalData(tagSelectHTMLId, entryID, entryText, entryDefinition) {
    document.getElementById('entryText').value = entryText
    document.getElementById('entryDef').value = entryDefinition

    setSelectData(entryID)
    setTagLibrary(tagSelectHTMLId)
}//end of setDictionaryModalData

function setSelectData(entryID) {
    const URL = `services/dictionaryService.php?Action=singleTags`
    $.post(URL, {entryID: entryID}, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("error")) {  //remove filter button and filter modal
            disableFiltering()
            document.getElementById('dictionary-body').innerHTML = `Error! ${data.error}. URL: ${URL}`
        }
        else {  //else, no backend error: set tags in select element
            $.each(data, function(index, tagData) {
                $(`#${tagSelectHTMLId}`).append(`<option value="${tagData.tagID}" selected>${tagData.tagText}</option>`)
            })
        }
    })
        .fail(function() {
            disableFiltering()
            document.getElementById('dictionary-body').innerHTML = `Error, could not connect! URL: ${URL}`
        })
}//end of setSelectData

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
    const URL = "./services/dictionaryService.php?Action=singleEdit"
    let xmlRequest = new XMLHttpRequest()
    xmlRequest.open("POST", URL)
    xmlRequest.onload = function() {
        let data = JSON.parse(xmlRequest.responseText)
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

function updateDictionaryHeader(dictionaryName) {
    //update page title to reflect classroom name
    document.title = `${dictionaryName} Dictionary`

    $('#dictionary-name').append(dictionaryName)
}

//addDictionaryFlag === "newDictionary" or "populatedDictionary"
function showAddToDictionaryButton(htmlId, addDictionaryFlag) {
    //add dictionaryFlag to the session but don't redirect anywhere
    addToSession({addDictionaryFlag: addDictionaryFlag})
    //as instructor, show button that allows them to add terms to the dictionary
    let addToDictionaryButton = `<a class="col-sm-auto btn dark" href="./addDictionary.php">Add to Dictionary</a>`
    document.getElementById(htmlId).innerHTML = addToDictionaryButton
}//end of showAddToDictionaryButton

$ (function() {
    const tableHtmlId = 'table-dictionary'
    const dictionaryID = dictionaryIDFromSession
    const dictionaryName = dictionaryNameFromSession
    const tagSelectHTMLId = 'tags-select'

    updateDictionaryHeader(dictionaryName)
    displayDictionaryTable(dictionaryID, tableHtmlId)
    setTagLibrary(tagSelectHTMLId)    //use select2 to have dynamic tag selection

    //hijack filter form to display filtered table
    let filterForm = $('#filter-dictionary-form')
    filterForm.submit(function (event) {
        event.preventDefault()

        const URL = './services/dictionaryService.php?Action=filter'
        const userData = { dictionaryID: dictionaryID }
        const filterModal = $('#filter-dictionary')

        displayFilteredTable(URL, userData, tagSelectHTMLId, filterModal, tableHtmlId)
    })
});//end of $(function()
