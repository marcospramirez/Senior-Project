function addTermFields() {
    const termHTML = `<hr class="hr-term">
            <div class="row align-items-start"> <!--Term #${termCount + 1} in Dictionary-->
                <div class="col-sm-auto"> <!--Term & Audio-->
                    <div class="row align-items-start"> <!--Term-->
                        <div class="form-group col"><input type="text" id="term-${termCount + 1}-text" class="form-control" title="term" name="termText" placeholder="Term"></div>
                    </div>
                    <div class="row align-items-start"> <!--Audio File-->
                        <div class="form-group col"><input type="file" id="term-${termCount + 1}-audio" class="form-control" accept="audio/*" name="audio"></div>
                    </div>
                </div>
                <div class="col"> <!--Definition & Tags-->
                    <div class="row align-items-start"> <!--Definition-->
                        <div class="form-group col"><textarea id="term-${termCount + 1}-definition" class="form-control" title="definition" name="definitionText" placeholder="Definition"></textarea>
                        </div>
                    </div>
                    <div class="row align-items-start"> <!--Tags-->
                        <div class="form-group col"><input type="text" id="term-${termCount + 1}-tags" class="form-control tags" title="tags" name="tagsText" placeholder="Tags"></div>
                    </div>
                </div>
            </div>`

    $('#terms').append(termHTML)

    termCount++
}

function createDictionary() {
    
}

function getTermsInformation() {

}

var termCount = 1   //page loads with one term & need at least one term in a dictionary
$(function () {
    //set form variable
    let form = $('#new-dictionary-form')

    //"hijack" form submit button
    form.submit(function (event) {
        event.preventDefault()  //prevent default form action

        console.log("YOINK!")

        //clear error messages
        const errormsg = $('#add-dictionary-error-message')
        errormsg.empty()

        dictionaryID = createDictionary()

        terms = getTermsInformation()


    })
})