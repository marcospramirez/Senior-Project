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
                    let return_data = []
                    $.each(json, function (index, entry) {
                        return_data.push([entry.entryAudioPath, entry.entryText, entry.entryDefinition])
                        entryIDArray.push(entry.entryID)
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

    if(role === "instructor") { //if instructor, allow instructor to edit and delete dictionary terms
        columnData.push({
                orderable: false,
                data: "edit",
                width: "5%",
                defaultContent: "<button title='Edit Term' class=\"btn btn-outline-info term edit\"><i class=\"fas fa-edit\"></i></button>"
            },
            {
                orderable: false,
                data: "delete",
                width: "5%",
                defaultContent: "<button title='Delete Term' class=\"btn btn-outline-danger term delete\"><i class=\"fas fa-trash\"></i></button>"
            })
    } else { //role === student, allow student to add term to their classroom vocab list
        columnData.push({
            orderable: false,
            data: "add",
            width: "5%",
            defaultContent: "<button class=\"btn btn-outline-info term vocab-list-add-remove add\"><i class=\"fas fa-plus\"></i></button>"
        })
    }

    return columnData
}//end of getDictionaryColumnData

function setDictionaryButtonListeners(role, tableHtmlId) {
    const tableBody = $(`#${tableHtmlId} tbody`)
    tableBody.on( 'click', 'button.audio', function () {
        const table = $(`#${tableHtmlId}`).DataTable()
        const audioPath = table.row($(this).parents('tr')).data()[0]
        playAudio(audioPath)
    })

    if(role === "instructor") {
        tableBody.on( 'click', 'button.edit', function () {
            const table = $(`#${tableHtmlId}`).DataTable()
            const row = table.row($(this).parents('tr'))

            editDictionaryButtonClicked(tableHtmlId, row)
        })//end of button.edit onclick


        //delete button clicked: show modal to confirm delete. If confirmed,
        //delete entry in database and delete table row
        tableBody.on( 'click', 'button.delete', function () {
            const table = $(`#${tableHtmlId}`).DataTable()
            const row = table.row($(this).parents('tr'))

            entryIDArray = deleteDictVocabButtonClicked(table, tableHtmlId, row, entryIDArray)
        })
    }//end of setting listeners for instructor functions
    else {  //role === student
        tableBody.on( 'click', 'button.vocab-list-add-remove', function () {
            const table = $(`#${tableHtmlId}`).DataTable()
            const row = table.row($(this).parents('tr'))
            const userData = {
                email: emailFromSession,
                classroomID: classroomIDFromSession,
                entryID: entryIDArray[row.index()]
            }
            const audioBtn = $(this).parents('tr')[0].childNodes[0].childNodes[0]
            const addBtn = $(this)[0]
            const addBtnIcon = addBtn.childNodes[0]

            if(addBtn.classList.contains("add")) {  //add term to classroom vocab list
                toggleVocabListBtn('adding', addBtnIcon)    //change btn icon to loading icon

                let URL = './services/personalVocabListService.php?Action=addToVocabList'

                $.post(URL, userData, function (data) {
                    data = JSON.parse(data)
                    if(data.hasOwnProperty("message")) {
                        if(data.message === "success") {    //if post was successful, change row color and btn icon
                            toggleVocabListBtn('added', addBtnIcon, table, row, audioBtn, addBtn)
                        }}
                })
            }else if(addBtn.classList.contains("remove")) {
                toggleVocabListBtn('removing', addBtnIcon)    //change btn icon to loading icon

                let URL = './services/personalVocabListService.php?Action=removeFromVocabList'
                $.post(URL, userData, function (data) {
                    data = JSON.parse(data)
                    if(data.hasOwnProperty("message")) {
                        if(data.message === "success") {    //if post was successful, change row color and btn icon
                            toggleVocabListBtn('removed', addBtnIcon, table, row, audioBtn, addBtn) //change btn icon to checkmark icon
                        }}
                })
                .fail(function() {
                    window.alert(`Error, could not connect! URL: ${URL}`)
                })
            }
        })//end of button.edit onclick
    }
}//end of setDictionaryButtonListeners


//as the term is being added to the personal vocab list, show this change in the button and row color
//the button has five states: default state (add icon in button), adding to vocab list (loading icon), confirming that it was added to the vocab list (check mark in button),
//removing from the vocab list (loading icon), and confirming that it was removed (return to default state: add icon in button).
function toggleVocabListBtn(stateFlag, addBtnIcon, table = null, row = null, audioBtn = null, addBtn = null) {
    const loadingIcon = '•••'
    if(stateFlag === 'adding') {  //signify that term is being added
        addBtnIcon.classList.remove("fa-plus")
        addBtnIcon.innerHTML = loadingIcon
    } else if(stateFlag === 'added') {  //signify that term was added
        addBtnIcon.innerHTML = ''
        addBtnIcon.classList.add("fa-check")

        const darkBG = {color: 'white', backgroundColor: '#172b42'}
        const rowNode = table.row(row.index()).node()
        $(rowNode).animate(darkBG, 'slow')

        audioBtn.classList.add("darkBtn")
        addBtn.classList.add("darkBtn")
        addBtn.classList.remove("add")
        addBtn.classList.add("remove")
    } else if(stateFlag === 'removing') {   //signify that term is being removed
        addBtnIcon.classList.remove("fa-eraser")
        addBtnIcon.classList.remove("fa-check")
        addBtnIcon.innerHTML = loadingIcon
    }
    else if(stateFlag === 'removed') {   //signify that term was removed & ready to be added
        addBtnIcon.innerHTML = ''
        addBtnIcon.classList.add("fa-plus")

        const normalBG = {color: '#343434', backgroundColor: 'transparent'}
        const rowNode = table.row(row.index()).node()
        $(rowNode).animate(normalBG, 'slow')

        audioBtn.classList.remove("darkBtn")
        addBtn.classList.remove("darkBtn")
        addBtn.classList.remove("remove")
        addBtn.classList.add("add")
    }
}//end of toggleVocabListBtn

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

            const newPlainTextTableData = {entryAudioPath: newEntryAudio, entryText: newEntryText, entryDefinition: newEntryDefinition}
            editEntry(tableHtmlId, row, formData, newPlainTextTableData, editModalID, errorMsgId)
            removeFormListeners()   //if successful, remove all form event listeners
        }else { //user didn't change term, show error message
            document.getElementById(errorMsgId).innerHTML = 'Please edit the term or close the dialog box.'
        }

        $(`#${editModalID}`).on('hide.bs.modal', function (e) {
            removeFormListeners()   //if user closes modal, remove event listeners
        })
    })//end of form submit event listener
}//end of editDictionaryButtonClicked

function removeFormListeners() {
    let oldForm = document.forms.namedItem("editTermForm")
    let newForm = oldForm.cloneNode(true)
    oldForm.parentNode.replaceChild(newForm, oldForm)
}

//show entry data in edit form & return entry
function setDictionaryModalData(tagSelectHTMLId, entryID, entryText, entryDefinition) {
    document.getElementById('entryText').value = entryText
    document.getElementById('entryDef').value = entryDefinition

    setSelectData(entryID)
}//end of setDictionaryModalData

function setSelectData(entryID) {
    const tagSelectHTMLId = 'edit-tags'
    const dictionaryBodyHTMLId = 'dictionary-body'
    const URL = `services/dictionaryService.php?Action=singleTags`
    $.post(URL, {entryID: entryID}, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("error")) {  //remove filter button and filter modal
            disableFiltering()
            document.getElementById(dictionaryBodyHTMLId).innerHTML = `Error! ${data.error}. URL: ${URL}`
        }
        else {  //else, no backend error: set tags in select element
            let optionHTML = ''
            $.each(data.results, function(index, tagData) {
                optionHTML += `<option value="${tagData.id}" selected>${tagData.text}</option>`
            })
            document.getElementById(tagSelectHTMLId).innerHTML = optionHTML
        }
    })//end of post
        .fail(function() {
            disableFiltering()
            showErrorMessage(dictionaryBodyHTMLId, URL)
        })
}//end of setSelectData

//make sure that the entry data has been changed, otherwise, don't submit
function dictionaryEntryChange(entryText, entryDefinition, entryTagIDArray, entryAudio, newEntryText, newEntryDefinition, newEntryTagIDArray, newEntryAudio) {
    if(entryText !== newEntryText) return true
    else if(entryDefinition !== newEntryDefinition) return true
    else if(!areMatchingArrays(entryTagIDArray, newEntryTagIDArray)) return true
    else if(entryAudio !== newEntryAudio || newEntryAudio !== '') return true
    else return false
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

function editEntry(tableHtmlId, row, formData, newPlainTextTableData, editModalID, errorMsgId) {
    const URL = "./services/dictionaryService.php?Action=singleEdit"
    let xmlRequest = new XMLHttpRequest()
    xmlRequest.open("POST", URL)
    xmlRequest.onload = function() {
        let data = JSON.parse(xmlRequest.responseText)
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, edit row in table
                const newTermData = [newPlainTextTableData.entryAudioPath, newPlainTextTableData.entryText, newPlainTextTableData.entryDefinition]
                editTableRow(newTermData, tableHtmlId, row,editModalID)
            }} else showErrorMessage(errorMsgId, URL, data)   //else, backend error: show error message
    };
    xmlRequest.send(formData);
}//end of editEntry

function updateDictionaryHeader(dictionaryName) {
    //update page title to reflect classroom name
    document.title = `${dictionaryName} Dictionary`

    $('#dictionary-name').append(dictionaryName)
}

function setDeleteDictionaryButton(email, dictionaryID, dictionaryName) {
    //for styling reasons, move dictionary-name classes around
    let dictionaryNameHeader = $("#dictionary-name")
    dictionaryNameHeader.removeClass("col").addClass("col-sm-auto")

    //set delete dictionary button
    dictionaryNameHeader.after('<div class="col"><button id="delete-dictionary-btn" class="btn round-delete" style="display: none" data-toggle="modal" data-target="#delete-dictionary"><i class="fas fa-trash"></button></div>')

    $("#dictionary-header").hover(function(){
        $("#delete-dictionary-btn").stop(true, false).fadeIn()
    }, function(){
        $("#delete-dictionary-btn").stop(true, true).fadeOut()
    });

    //set classroom name in modal
    document.getElementById('deleting-dictionary').innerHTML = dictionaryName

    //user confirmed delete: delete dictionary
    $(`#submit-delete-dictionary`).on( 'click', function () {
        deleteDictionary(email, dictionaryID)
    })
}//end of setDeleteDictionaryButton

function deleteDictionary(email, dictionaryID) {
    const errorMsgId = 'delete-error-message'
    const URL = './services/dictionaryService.php?Action=deleteDictionary'
    const userData = {
        email: email,
        dictionaryID: dictionaryID
    }
    $.post(URL, userData, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, exit out of dictionary/redirect to classroom
                window.location.replace('./classroom.php')
            }} else showErrorMessage(errorMsgId, URL, data)   //else, backend error: show error message
    })
    .fail(function() { showErrorMessage(errorMsgId, URL) })
}//end of deleteDictionary

$ (function() {
    const tableHtmlId = 'table-dictionary'
    const dictionaryID = dictionaryIDFromSession
    const dictionaryName = dictionaryNameFromSession
    const filterSelect2HTMLId = 'tags-select'
    const editTermSelect2HTMLId = 'edit-tags'

    updateDictionaryHeader(dictionaryName)
    displayDictionaryTable(dictionaryID, tableHtmlId)
    setTagLibrary(filterSelect2HTMLId)    //use select2 to filter the dictionary
    setTagLibrary(editTermSelect2HTMLId)    //use select2 to edit a term in the dictionary
    if(roleFromSession === 'instructor'){
        showAddToDictionaryButton('add-more', 'populatedDictionary')
        setDeleteDictionaryButton(emailFromSession, dictionaryID, dictionaryName)
    }

    //hijack filter form to display filtered table
    let filterForm = $('#filter-dictionary-form')
    filterForm.submit(function (event) {
        event.preventDefault()

        const URL = './services/dictionaryService.php?Action=filter'
        const userData = { dictionaryID: dictionaryID }
        const filterModal = $('#filter-dictionary')

        displayFilteredTable(URL, userData, filterSelect2HTMLId, filterModal, tableHtmlId)
    })
});//end of $(function()
