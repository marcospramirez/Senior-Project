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
                        <div class="form-group col"><input type="text" class="form-control tags" title="tags" name="entryTags[]" placeholder="Tags" required></div>
                    </div>
                </div>
            </div>`

    $('#terms').append(termHTML)

    termCount++
}

$(function () {
    let urlParams = parseURLParams(location.href)
    const classID = urlParams.classID[0]

    const hiddenImport = $('#import-hidden')
    addHiddenClassIdInput(hiddenImport, classID)

    const hiddenAddToDictionary = $('#add-dictionary-hidden')
    addHiddenClassIdInput(hiddenAddToDictionary, classID)
})