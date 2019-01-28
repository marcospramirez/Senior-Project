var termCount = 1   //page loads with one term & need at least one term in a dictionary
function addTermFields() {
    const termHTML = `<hr class="hr-entries">
            <div id="term${termCount + 1}" class="row align-items-start"> <!--Term #${termCount + 1} in Dictionary-->
                <div class="col-sm-auto"> <!--Term & Audio-->
                    <div class="row align-items-start"> <!--Term-->
                        <div class="form-group col"><input type="text" class="form-control" title="term" name="entryText[]" placeholder="Term" required></div>
                    </div>
                    <div class="row align-items-start"> <!--Audio File-->
                        <div class="form-group col"><input type="file" class="form-control" accept="audio/*" name="entryAudio[]" required></div>
                    </div>
                </div>
                <div class="col"> <!--Definition & Tags-->
                    <div class="row align-items-start"> <!--Definition-->
                        <div class="form-group col"><textarea class="form-control" title="definition" name="entryDefinition[]" placeholder="Definition" required></textarea>
                        </div>
                    </div>
                    <div class="row align-items-start"> <!--Tags-->
                        <div class="form-group col"><select id="tags-select-${termCount + 1}" multiple="multiple" type="text" class="form-control tags" title="tags" name="entryTags[]" placeholder="Tags" required></div>
                    </div>
                </div>
            </div>`

    $('#terms').append(termHTML)

    termCount++

    $("#tags-select-" + termCount).select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        }
    });
}

function setAddDictionaryHeader(element, classroomName,) {
    //update page title to reflect classroom name
    document.title = `${classroomName} - Add Dictionary`
    //update header to reflect classroom name
    $(`#${element}`).append(classroomName)
}

$(function () {

    $("#tags-select").select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        }
    });


    const classroomID = classroomIDFromSession
    const clasroomName = classroomNameFromSession

    setAddDictionaryHeader('add-dict-header',clasroomName)

    //todo: hijack form, redirect after success

    //add classroomID as a hidden input named "class"
    //for both the 'import' form and the 'add dictionary' form
    const importDictionaryForm = $('#import-hidden')
    addHiddenInputToForm(importDictionaryForm, 'class', classroomID)

    const addDictionaryForm = $('#add-dictionary-hidden')
    addHiddenInputToForm(addDictionaryForm, 'class', classroomID)

    //todo: need to add a hidden input("Action": "addDictionaryCSV" & "Action": "addDictionary"),
    //but dictionaryService.php expects them in GET, while I'm sending them through POST...
})