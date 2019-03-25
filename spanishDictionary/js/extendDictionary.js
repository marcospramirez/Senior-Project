function playAudio(audioPath) {
    const audio = new Audio(`audio/${audioPath}`)
    audio.play()
}

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

//get tag data from select2 html element
function getTagData(selectHTMLId) {
    let selectData = $(`#${selectHTMLId}`).select2('data');
    return parseSelectData(selectData)
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
}//end of parseSelectData

//grab entry text and populate modal data with it.
//once submit data for deletion, send to server & once complete, show changes on table
function deleteDictVocabButtonClicked(table, tableHtmlId, row, entryIDArray) {
    let newEntryIDArray = entryIDArray
    const entryID = entryIDArray[row.index()]
    const entryText = row.data()[1]
    const deleteModalID = 'delete-term'

    document.getElementById('deleting-term').innerHTML = entryText
    $(`#${deleteModalID}`).modal('show')

    //user confirmed delete: delete entry
    $(`#submit-delete-term`).on( 'click', function () {
        const tableSize = table.column(0).data().length
        newEntryIDArray = deleteEntry(row, entryIDArray, entryID, deleteModalID, tableSize, tableHtmlId)
    })

    return newEntryIDArray
}//end of deleteDictVocabButtonClicked

//AJAX request to delete term at entryID. If success, remove row from table
function deleteEntry(row, entryIDArray, entryID, deleteModalID, previousTableSize, tableHtmlId) {
    const errorMsgId = 'delete-error-message'
    const URL = './services/dictionaryService.php?Action=singleDelete'
    $.post(URL, {entry: entryID}, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, remove row from table
                if(previousTableSize-1 === 0) setEmptyDictVocabView(roleFromSession, tableHtmlId)  //just deleted last term in the dictionary
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

    return entryIDArray //return new entryIDArray with removed entry
}//end of deleteEntry

function setEmptyDictVocabView(role, tableHtmlId) {
    const contentBodyHtmlId = getFileNameFromPath().includes("dictionary") ? 'dictionary-body' : 'list-body'

    hideTable(tableHtmlId, contentBodyHtmlId)
    disableFiltering()
    if(role === "instructor") showAddToDictionaryButton(contentBodyHtmlId, 'newDictionary')
}

//addDictionaryFlag === "newDictionary" or "populatedDictionary"
function showAddToDictionaryButton(htmlId, addDictionaryFlag) {
    //add dictionaryFlag to the session but don't redirect anywhere
    addToSession({addDictionaryFlag: addDictionaryFlag})
    //as instructor, show button that allows them to add terms to the dictionary
    let addToDictionaryButton = `<a class="col-sm-auto btn dark" href="./addDictionary.php">Add to Dictionary</a>`
    document.getElementById(htmlId).innerHTML = addToDictionaryButton
}//end of showAddToDictionaryButton

function hideTable(tableHtmlId, contentBodyHtmlId) {
    $(`#${tableHtmlId}`).DataTable().destroy()  //make dataTable back to a normal table
    document.getElementById(tableHtmlId).style.display = "none" //hide normal table

    $(`#${contentBodyHtmlId}`).append("<h2 class='col'>No content.</h2>\n")    //show "no content in dictionary" message
}

function disableFiltering() {
    //remove element for filter button
    const filterButtonHTML = document.getElementById('filter-dictionary-btn')
    filterButtonHTML.parentNode.removeChild(filterButtonHTML)

    //remove element for filter modal
    const filterModalHTML = document.getElementById('filter-dictionary')
    filterModalHTML.parentNode.removeChild(filterModalHTML)
}//end of disableFiltering

//get tags, destroy current table and replace with table with filtered terms
function displayFilteredTable(URL, userData, tagSelectHTMLId, filterModal, tableHtmlId) {
    //clear error messages
    const errorMsgId = 'filter-error-message'
    document.getElementById(errorMsgId).innerHTML = ''

    userData.tags = getTagData(tagSelectHTMLId).idArray

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

            filterModal.modal('hide')  //hide modal
            //make dataTable back to a normal table
            $(`#${tableHtmlId}`).DataTable().clear().destroy()

            const fileName = getFileNameFromPath()
            const columnData = fileName === 'dictionary.php' ? getDictionaryColumnData(roleFromSession) : getVocabListColumnData()

            //show table with new data
            $(`#${tableHtmlId}`).DataTable({
                data: tableData,
                columns: columnData
            });

            if(fileName === 'dictionary.php') {
                showClearFilterButton('dictionary-header', userData.dictionaryID, tableHtmlId)
                setDictionaryButtonListeners(roleFromSession, tableHtmlId)
            } else {
                showClearFilterButton('list-header', userData.classroomID, tableHtmlId)
                setVocabListButtonListeners(tableHtmlId)
            }
        }//end of else
    })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
}//end of displayFilteredTable

function showClearFilterButton(headerId, data, tableHtmlId) {
    const clearFilterButton = `<button id="clear-filter" class="col-sm-auto btn btn-light" onclick="clearFilter(${data}, '${tableHtmlId}')">Clear Filters</button>`
    document.getElementById(headerId).innerHTML += clearFilterButton
}

//delete the whole table and then make the default one again
function clearFilter(data, tableHtmlId) {
    const clearFilterButtonId = document.getElementById('clear-filter')
    clearFilterButtonId.parentNode.removeChild(clearFilterButtonId)

    $(`#${tableHtmlId}`).DataTable().clear().destroy()

    if(getFileNameFromPath() === 'dictionary.php') displayDictionaryTable(data, tableHtmlId)
    else displayVocabListTable(data, tableHtmlId)
}

//in order to edit table at specific row index, redraw whole table with new entry data
function editTableRow(data, tableHtmlId, row, editModalID) {
    let table = $(`#${tableHtmlId}`).DataTable()
    const index = row.index()
    row.remove()    //delete old row
    let currentRows = table.data().toArray()  //get table data
    currentRows.splice(index, 0, data)   //add new data to table data
    table.clear()   //empty the table
    table.rows.add(currentRows).draw() //redraw table with edited term in correct row index
    let rowNode = table.row(index).node()
    $(`#${editModalID}`).modal('hide') //hide modal to show table change
    animateRowBackground(rowNode) //animate added row to emphasize change
}//end of editTableRow

//animate background color of added row to pulse
function animateRowBackground(rowNode) {
    const normalBG = {color: '#343434', backgroundColor: 'transparent'}
    const darkBG = {color: 'white', backgroundColor: '#172b42'}
    for(let i = 0; i < 3; i++) {    //pulse bg color 3 times
        $(rowNode).animate(darkBG, 'slow')
        $(rowNode).animate(normalBG, 'slow')
    }
    $(rowNode).animate(darkBG, 'slow')  //animate once more to darkBG color
    $(rowNode).delay(5*1000).animate(normalBG, 'slow')   //keep darkBG color for 15 seconds longer, then revert back
}//end of animateRowBackground