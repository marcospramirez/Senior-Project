var termCount = 1   //page loads with one term & need at least one term in a dictionary
function addTermFields() {
    const termHTML = `<hr class="hr-term">
            <div id="term${termCount + 1}" class="row align-items-start"> <!--Term #${termCount + 1} in Dictionary-->
                <div class="col-sm-auto"> <!--Term & Audio-->
                    <div class="row align-items-start"> <!--Term-->
                        <div class="form-group col"><input type="text" class="form-control" title="term" name="termText${termCount + 1}" placeholder="Term" required></div>
                    </div>
                    <div class="row align-items-start"> <!--Audio File-->
                        <div class="form-group col"><input type="file" class="form-control" accept="audio/*" name="termAudio[]" required></div>
                    </div>
                </div>
                <div class="col"> <!--Definition & Tags-->
                    <div class="row align-items-start"> <!--Definition-->
                        <div class="form-group col"><textarea class="form-control" title="definition" name="termDefinition${termCount + 1}" placeholder="Definition" required></textarea>
                        </div>
                    </div>
                    <div class="row align-items-start"> <!--Tags-->
                        <div class="form-group col"><input type="text" class="form-control tags" title="tags" name="termTags${termCount + 1}" placeholder="Tags" required></div>
                    </div>
                </div>
            </div>`

    $('#terms').append(termHTML)

    termCount++
}

// function createDictionary(classID, errormsg) {
//     const URL = `./services/addDictionary.php?class=${classID}`
//     const dictionaryName= $('#dictionary-name').val()
//     const userData = {
//         newDictionary: dictionaryName
//     }
//     //using AJAX, recieve dictionaryID of new dictionary
//     $.post(URL, userData, function(data) {
//         const dictionaryID = data
//         let terms = getTerms()
//
//         insertTerms(dictionaryID, terms)
//     })
//     .fail(function() {
//         errormsg.append(`Error, could not connect! URL: ${URL}`)
//     })
// }
//
// function getTerms() {
//     const numOfTerms = getNumOfTerms()
//
//     let termsArray = []
//
//     let audioIndex = 2
//     for(let termNumber = 1; termNumber <= numOfTerms; termNumber++) {
//         const termText = $(`#term-${termNumber}-text`).val()    //string
//         const termDefinition = $(`#term-${termNumber}-definition`).val()    //string
//         const termTags = $(`#term-${termNumber}-tags`).val() //string, for now
//         const termAudio = $('#new-dictionary-form')[0][audioIndex].files[0]    //audio file
//         audioIndex += 4 //point to next term's audio file
//
//         const term = {
//             text: termText,
//             definition: termDefinition,
//             tags: termTags,
//             audio: termAudio
//         }
//
//         termsArray.push(term)
//     }//end of for loop
//
//     return termsArray
// }   //end of getTerms
//
//
// function getNumOfTerms() {
//     const numOfElements = $('#new-dictionary-form')[0].length //# of elements in form
//     //remove dictionaryName & buttons (3) from element count &
//     //divide by the number of elements each term has (4) to get
//     //the number of terms in the form
//     const numOfTerms = (numOfElements - 3) / 4
//
//     return numOfTerms
// }
//
// function insertTerms(dictionaryID, terms) {
//     const URL = `./services/dictionaryService.php?dictionary=${dictionaryID}`
//
//     $.each(terms, function(i, term) {   //how am i supposed to do this???
//         //using dictionaryService.php, insert all the terms
//     })
//
//
//     const userData = {
//         newEntry: true,
//         newDictionary: dictionaryName
//     }
//     //using AJAX, recieve dictionaryID of new dictionary
//     $.post(URL, userData, function(data) {
//         const dictionaryID = data
//         let terms = getTerms(errormsg)
//
//         insertTerms(terms)
//     })
//         .fail(function() {
//             errormsg.append(`Error, could not connect! URL: ${URL}`)
//         })
// }

$(function () {
    let urlParams = parseURLParams(location.href)
    const classID = urlParams.classID[0]
    const importHiddenInputs = $('#import-hidden')
    importHiddenInputs.append(`<input type="hidden" name="class" value="${classID}">`)

    const addDictionaryHiddenInput = $('#add-dictionary-hidden')
    addDictionaryHiddenInput.append(`<input type="hidden" name="class" value="${classID}">`)

    // //set form variable
    // let form = $('#new-dictionary-form')
    //
    // //"hijack" form submit button
    // form.submit(function (event) {
    //     event.preventDefault()  //prevent default form action
    //
    //     console.log("YOINK!")
    //
    //     let urlParams = parseURLParams(location.href)
    //     const classID = urlParams.classID[0]
    //
    //     //clear error messages
    //     const errormsg = $('#add-dictionary-error-message')
    //     errormsg.empty()
    //
    //     createDictionary(classID, errormsg)
    // })
})