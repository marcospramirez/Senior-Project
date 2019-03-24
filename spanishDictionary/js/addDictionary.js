var termCount = 1   //page loads with one term & need at least one term in a dictionary
function addTermFields() {
    const termHTML = `<hr class="hr-entries">
            <div id="term${termCount + 1}" class="row align-items-start"> <!--Term #${termCount + 1} in Dictionary-->
                <div class="col-sm-auto"> <!--Term & Audio-->
                    <div class="row align-items-start"> <!--Term-->
                        <div class="form-group col"><input type="text" class="form-control" title="term" name="entryText[]" placeholder="Term" required></div>
                    </div>
                    <div class="row align-items-start"> <!--Audio File-->
                        <div class="form-group col"><input type="file" class="form-control" accept="audio/*" name="entryAudio[]"></div>
                    </div>
                </div>
                <div class="col"> <!--Definition & Tags-->
                    <div class="row align-items-start"> <!--Definition-->
                        <div class="form-group col"><textarea class="form-control" title="definition" name="entryDefinition[]" placeholder="Definition" required></textarea>
                        </div>
                    </div>
                    <div class="row align-items-start"> <!--Tags-->
                        <div class="form-group col"><select id="tags-select-${termCount + 1}" multiple="multiple" type="text" class="form-control tags" title="tags" name="entryTags[${termCount}][]" placeholder="Tags"></div>
                    </div>
                </div>
            </div>`

    $('#terms').append(termHTML)

    termCount++

    $("#tags-select-" + termCount).select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags',
        width: '100%'
    });
}

//don't really need to input a dictionary name if you're adding to a preexisting dictionary
function removeDictionaryInput() {
    const dictionaryNameCSV = document.getElementById('dict-name-csv')
    const dictionaryName = document.getElementById('dict-name')
    dictionaryNameCSV.parentNode.removeChild(dictionaryNameCSV)
    dictionaryName.parentNode.removeChild(dictionaryName)
}

function setAddDictionaryHeader(element, customHeaderData, addDictionaryFlag) {
    let documentTitle = ''
    let headerText = ''
    if(addDictionaryFlag === 'populatedDictionary') {   //add terms to populated dictionary
        documentTitle = `${customHeaderData} - Add To Dictionary`
        headerText = `Add Terms to ${customHeaderData}`
    } else {    //add terms to new/empty dictionary
        documentTitle = `${customHeaderData} - Add Dictionary`
        headerText = `Add Dictionary to ${customHeaderData}`
    }

    //update page title to reflect classroom name
    document.title = documentTitle
    //update header to reflect classroom name
    document.getElementById(element).innerHTML = headerText
}//end of setAddDictionaryHeader

$(function () {
    const classroomID = classroomIDFromSession
    const clasroomName = classroomNameFromSession
    const addDictionaryFlag = addDictionaryFlagFromSession
    let dictionaryID = undefined
    let dictionaryName = undefined
    if(addDictionaryFlag === 'populatedDictionary') {
        dictionaryID = dictionaryIDFromSession
        dictionaryName = dictionaryNameFromSession
        removeDictionaryInput()
    }

    $("#tags-select").select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags',
        width: '100%'
    });

    //change header depending on how
    const customHeaderData = addDictionaryFlag === 'populatedDictionary' ? dictionaryName : clasroomName
    setAddDictionaryHeader('add-dict-header', customHeaderData, addDictionaryFlag)

    //add classroomID as a hidden input named "class"
    //for both the 'import' form and the 'add dictionary' form
    const importDictionaryForm = $('#import-hidden')
    const addDictionaryForm = $('#add-dictionary-hidden')
    addHiddenInputToForm(importDictionaryForm, 'class', classroomID)
    addHiddenInputToForm(addDictionaryForm, 'class', classroomID)
    //if adding to populated dictionary, add dictionaryID to form data
    if(addDictionaryFlag === 'populatedDictionary') addHiddenInputToForm(addDictionaryForm, 'dictionaryID', dictionaryID)
})