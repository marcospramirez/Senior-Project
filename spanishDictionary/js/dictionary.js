let entryIDArray = []
function displayTable(dictionaryID, tableHtmlId) {
    const role = roleFromSession

    //initialize table
    const URL = `./services/dictionaryService.php?Action=single&dictionaryID=${dictionaryID}`
    let table = $(`#${tableHtmlId}`).DataTable({
        ajax: {
            url: URL,
            dataSrc: function (json) {
                if(json.length === 0) { //no terms in dictionary, hide content
                    setEmptyDictionaryView(role, tableHtmlId)
                } else {
                    //allow instructor to add more terms to the dictionary
                    if(roleFromSession === 'instructor') showAddToDictionaryButton('add-more', 'populatedDictionary')

                    let return_data = []
                    $.each(json, function (index, entry) {
                        return_data.push([entry.entryAudioPath, entry.entryText, entry.entryDefinition])
                        if(role === "instructor") {
                            entry.entryID = index
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
                const tableSize = table.column(0).data().length
                deleteEntry(row, entryID, deleteModalID, tableSize)
            })
        })
    }//end of setting listeners for instructor functions
}//end of setDictionaryButtonListeners

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

//set the tag library in select2, which allows dynamic tag selection for the current entry/term
function setTagLibrary(tagSelectHTMLId) {
    $(`#${tagSelectHTMLId}`).select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags',
        width: '100%'
    });
}//end of setTagLibrary

function disableFiltering() {
    //remove element for filter button
    const filterButtonHTML = document.getElementById('filter-dictionary-btn')
    filterButtonHTML.parentNode.removeChild(filterButtonHTML)

    //remove element for filter modal
    const filterModalHTML = document.getElementById('filter-dictionary')
    filterModalHTML.parentNode.removeChild(filterModalHTML)
}//end of disableFiltering

function getTagData(selectHTMLId) {
    let selectData = $(selectHTMLId).select2('data');
    return parseSelectData(selectData)
}

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
        if(data.hasOwnProperty("msg")) {
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
function deleteEntry(row, entryID, deleteModalID, previousTableSize, tableHtmlId) {
    const errorMsgId = 'delete-error-message'
    const URL = './services/dictionaryService.php?Action=singleDelete'
    $.post(URL, {entry: entryID}, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("msg")) {
            if(data.message === "success") {    //if post was successful, remove row from table
                if(previousTableSize-1 === 0) setEmptyDictionaryView(roleFromSession, tableHtmlId)  //just deleted last term in the dictionary
                else {  //table not empty
                    entryIDArray.splice(row.index(), 1)  //remove remove entryID at index
                    row.remove().draw(false) //remove row and redraw, but don't reset the table's page
                }
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

function setEmptyDictionaryView(role, tableHtmlId) {
    const dictionaryBodyHtmlId = 'dictionary-body'

    hideTable(tableHtmlId, dictionaryBodyHtmlId)
    document.getElementById('filter-dictionary-btn').style.display = "none" //hide filter button
    if(role === "instructor") showAddToDictionaryButton(dictionaryBodyHtmlId, 'newDictionary')
}

function hideTable(tableHtmlId, dictionaryBody) {
    $(`#${tableHtmlId}`).DataTable().destroy()  //make dataTable back to a normal table
    document.getElementById(tableHtmlId).style.display = "none" //hide normal table

    dictionaryBody.append("<h2 class='col'>No Content in Dictionary</h2>\n")    //show "no content in dictionary" message
}

function showClearFilterButton(dictionaryID, tableHtmlId) {
    const headerId = 'dictionary-header'
    const clearFilterButton = `<button id="clear-filter" class="col-sm-auto btn btn-light" onclick="clearFilter(${dictionaryID}, '${tableHtmlId}')">Clear Filters</button>`
    document.getElementById(headerId).innerHTML += clearFilterButton
}

//delete the whole table and then make the default one again
function clearFilter(dictionaryID, tableHtmlId) {
    const clearFilterButtonId = document.getElementById('clear-filter')
    clearFilterButtonId.parentNode.removeChild(clearFilterButtonId)

    $(`#${tableHtmlId}`).DataTable().clear().destroy()
    displayTable(dictionaryID, tableHtmlId)
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

    const tagIdArray = getTagData(tagSelectHTMLId).idArray

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
            document.getElementById(errorMsgId).innerHTML = 'No terms in dictionary have those tags!'
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

            showClearFilterButton(dictionaryID, tableHtmlId)
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

$ (function() {
    const tableHtmlId = 'table-dictionary'
    const dictionaryID = dictionaryIDFromSession
    const dictionaryName = dictionaryNameFromSession

    updateHeader(dictionaryName)
    displayTable(dictionaryID, tableHtmlId)
    setTagLibrary('tags-select')    //use select2 to have dynamic tag selection

    //hijack filter form to display filtered table
    let filterForm = $('#filter-dictionary-form')
    filterForm.submit(function (event) {
        event.preventDefault()

        displayFilteredTable(tagSelectHTMLId, dictionaryID, tableHtmlId)
    })
});//end of $(function()
