let entryIDArray = []
function displayVocabListTable(classroomID, tableHtmlId) {
    const email = emailFromSession

    //initialize table
    const URL = `./services/personalVocabListService.php?Action=single&email=${email}&classroomID=${classroomID}`
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
        columns: getVocabListColumnData()
    })
    setVocabListButtonListeners(tableHtmlId)
}//end of displayVocabListTable

function getVocabListColumnData() {
    return [{
            orderable: false,
            width: "5%",
            data: null,
            defaultContent: "<button class=\"btn btn-outline-success term audio\"><i class=\"fas fa-volume-down\"></i></button>"
        },
        {title: "Term"},
        {title: "Definition"},
        {
            orderable: false,
            data: "delete",
            width: "5%",
            defaultContent: "<button class=\"btn btn-outline-danger term delete\"><i class=\"fas fa-trash\"></i></button>"
        }]
}//end of getVocabListColumnData

function setVocabListButtonListeners(tableHtmlId) {
    $(`#${tableHtmlId} tbody`).on( 'click', 'button.audio', function () {
        const table = $(`#${tableHtmlId}`).DataTable()
        const audioPath = table.row($(this).parents('tr')).data()[0]
        playAudio(audioPath)
    })

    //delete button clicked: show modal to confirm delete. If confirmed,
    //delete entry in database and delete table row
    $(`#${tableHtmlId} tbody`).on( 'click', 'button.delete', function () {
        const table = $(`#${tableHtmlId}`).DataTable()
        const row = table.row($(this).parents('tr'))

        entryIDArray = deleteDictVocabButtonClicked(table, tableHtmlId, row, entryIDArray)
    })
}//end of setVocabListButtonListeners

function updateVocabListHeader(classroomName) {
    //update page title to reflect classroom name
    document.title = `${classroomName} Vocab List`

    $('#list-name').append(` for ${classroomName}`)
}

$ (function() {
    const tableHtmlId = 'table-list'
    const classroomID = classroomIDFromSession
    const classroomName = classroomNameFromSession
    const tagSelectHTMLId = 'tags-select'

    updateVocabListHeader(classroomName)
    displayVocabListTable(classroomID, tableHtmlId)
    // setTagLibrary(tagSelectHTMLId)    //use select2 to have dynamic tag selection

    //hijack filter form to display filtered table
    let filterForm = $('#filter-list-form')
    filterForm.submit(function (event) {
        event.preventDefault()

        const URL = './services/personalVocabListService.php?Action=filter'
        const userData = {
            email: emailFromSession,
            classroomID: classroomID
        }
        const filterModal = $('#filter-list')

        displayFilteredTable(URL, userData, tagSelectHTMLId, filterModal, tableHtmlId)
    })
});//end of $(function()