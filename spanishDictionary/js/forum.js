function setForumHeader() {
    const classroomName = classroomNameFromSession
    //update title to reflect classroom name
    document.title = `${classroomName} Forum`
    //update header to reflect classroom name
    document.getElementById('forum-header').innerHTML = `<h1>${classroomName} Forum</h1>`
}

let questionCount = 0
//using AJAX, get list of all questions (and their respective answers) for the class and display into forum
function displayForum(forumHTMLID, classroomID) {
    const URL = `./services/questionService.php`
    const userData = {
        Action: 'list',
        classroom: classroomID
    }
    $.get(URL, userData, function(data) {
        data = JSON.parse(data) //parse data from string to JSON
        if(data.length === 0) document.getElementById('error-message').innerHTML = `No questions in the forum. Add one now!`
        else {  //questions in forum, show questions
            let forumHTML = ''
            if(data.length === 0) {
                forumHTML = '<div><h2 style="text-align: center;">No Questions in Forum.</h2></div>'
                questionCount = 1
            } else {
                forumHTML = getForumHTML(data)
                questionCount = data.length
            }

            document.getElementById(forumHTMLID).innerHTML = forumHTML

            let magicGrid = new MagicGrid({
                container: '#forum',
                gutter: 30,
                static: false,
                items: questionCount
            })
            magicGrid.listen(); //listen for changes in window size
        }//end of else: questions in forum, show questions
    })
    .fail(function() { showErrorMessage(errorMsgId, URL) })
}//end of displayForum

//parse data and create HTML for the questions in the forum
function getForumHTML(data) {
    const role = roleFromSession
    let unStarredQuestionsHTML = ''
    let starredQuestionsHTML = ''

    //for each question, get question data & answer(s) data & fill into the HTML
    $.each(data, function(index, questionData) {
        const questionID = questionData.questionID
        const questionType = questionData.questionType
        const questionText = questionData.questionText
        const questionName = role === "instructor" ? questionData.questionName : "Anonymous"  //instructors can see names, students cannot

        let questionHTML = getOpeningQuestionHTML(questionID, questionText, questionName)   //create the beginning HTML for the question

        $.each(questionData.answerArray, function(index, answerData) { //for each answer, create HTML according to user role & star status
            const answerID = answerData.answerID
            const starredAnswerID = questionData.starredAnswer
            const answerText = answerData.answerText
            const answerName = answerData.hasOwnProperty("answerName") ? answerData.answerName : undefined

            const answerHTML = getAnswerHTML(role, questionID, questionType, starredAnswerID, answerID, answerText, answerName)

            questionHTML += answerHTML
        })  //end of for each answer in question

        //if no starred answer, allow user to suggest their own answer
        if(questionData.starredAnswer === null) questionHTML += getSuggestAnswerHTML(questionID, questionType)

        questionHTML += getClosingQuestionHTML()    //create the ending HTML for the question

        //sort questions into unstarred and starred categories
        if(questionData.starredAnswer === null) unStarredQuestionsHTML += questionHTML
        else starredQuestionsHTML += questionHTML

    })  //end of for each question

    return unStarredQuestionsHTML + starredQuestionsHTML //construct forumHTML: forum question order is unstarred questions first
}//end of getForumHTML

function getOpeningQuestionHTML(questionID, questionText, questionName) {
    return `
        <div id="question-${questionID}" class="question content-frame border rounded">
            <div class="question-name" class="row"><div class="col">${questionName} asks...</div></div>
            <div id="question-text" class="row"><div class="col">${questionText}</div></div>
            <div class="question-body">
                <div id="question-${questionID}-answerlist" class="answer-list">
                    <div class="answer-header" class="row"><div class="col"><h3>Answers:</h3></div></div>
        `
}//end of getOpeningQuestionHTML

function getClosingQuestionHTML() {
    return '</div> </div> </div>'
}

function getAnswerHTML(role, questionID, questionType, starredAnswerID, answerID, answerText, answerName = false) {
    let starButtonHTML = ''
    let answerNameText = answerName && role === "instructor" ? answerName : 'Anonymous' //only show answerName if it exists and if user is an instuctor
    let addStarredClass = ''
    let addToDictionaryButtonHTML = ''

    if(role === 'instructor') { //instructors can view names, star questions and add question-answer pair to a dictionary
        starButtonHTML = `<div class="col col-sm-auto"><button id="answer-${answerID}-star-btn" class="btn btn-sm" title="Click to star answer" onclick="toggleStarredAnswer(${questionID}, ${questionType}, ${answerID}, ${starredAnswerID})"><i id="answer-${answerID}-star" class="far fa-star"></i></button></div>`
        if(answerID === starredAnswerID) {  //if answer is starred, change HTML accordingly
            addStarredClass = 'starred'  //add 'starred' class to change styling of answer
            starButtonHTML = starButtonHTML.replace('Click to star answer', 'Click to unstar answer')   //change button title to reflect toggle
            starButtonHTML = starButtonHTML.replace('far', 'fas')   //change the star icon from a outlined star to a solid one, indicating starred status
            if(questionType !== "3") addToDictionaryButtonHTML = getAddToDictBtnHTML(questionID, answerID)    //if question in correct format, allow instructor to add question to dictionary
        }
    } else if(answerID === starredAnswerID) addStarredClass = 'starred'  //role === student, show css changes to starred answers, but that's it


    return `        <div id="answer-${answerID}" class="question-${questionID}-answer ${addStarredClass} answer content-frame border rounded">
                        <div class="answer-body row align-items-center">
                            ${starButtonHTML}
                            <div id="answer-${answerID}-add-to-dict" class="col col-sm-auto">${addToDictionaryButtonHTML}</div>
                            <div class="col">
                                <div class="row answer-text"><div class="col">${answerText}</div></div>
                                <div class="answer-name" class="row"><div class="col">${answerNameText}</div></div>
                            </div>
                        </div>
                    </div>`
}//end of getAnswerHTML

function getAddToDictBtnHTML(questionID, answerID) {
    return `<button id="answer-${answerID}-add-to-dict-btn" class="btn btn-sm" title="Add to Dictionary" onclick="addQuestionToDictionary(${questionID})"><i class="fas fa-plus"></i></button>`
}

let questionToDelete = null
function addQuestionToDictionary(questionID) {
    const errorMsgId = 'add-to-dict-error-message'
    const selectHTMLId = 'dictionary-select'
    questionToDelete = questionID

    hideGoToDictionaryBtn()
    document.getElementById(errorMsgId).innerHTML = ''  //clear error message

    document.getElementById("submit-add-to-dict").style.display = "block"

    $('#add-to-dict').modal('show')

    //user confirmed add: add question to dictionary and delete question from forum
    $(`#submit-add-to-dict`).on( 'click', function () {
        let selectData = $(`#${selectHTMLId}`).select2('data')  //get data from select markup
        const dictionaryID = parseInt(selectData[0].id)
        const dictionaryName = selectData[0].text

        const URL = './services/questionService.php?Action=addQuestionToDictionary'
        const userData = {
            dictionaryID: dictionaryID,
            questionID: questionToDelete
        }
        $.post(URL, userData, function(data) {
            data = JSON.parse(data)
            if(data.hasOwnProperty("message")) {
                //if post was successful, delete question from forum & show button to go to dictionary
                if(data.message === "success") {
                    const successMessageHTMLId ="add-to-dict-success-message"
                    showGoToDictionaryBtn(dictionaryID, dictionaryName, successMessageHTMLId, `Term was added to ${dictionaryName}!`)
                    deleteQuestion(questionToDelete)
                    $("#submit-add-to-dict").off("click")
                    document.getElementById("submit-add-to-dict").style.display = "none"
            }} else showErrorMessage(errorMsgId, URL, data)   //else, backend error: show error message
        })
        .fail(function() { showErrorMessage(errorMsgId, URL) })
    })
}//end of addQuestionToDictionary

function deleteQuestion(questionID) {
    const question = document.getElementById(`question-${questionID}`)
    question.parentNode.removeChild(question)

    questionCount -= 1

    if(questionCount === 0) return  //don't construct empty MagicGrid

    let magicGrid = new MagicGrid({
        container: '#forum',
        gutter: 30,
        static: false,
        items: questionCount
    })

    magicGrid.positionItems();  //reposition items
    magicGrid.listen(); //listen for changes in window size
}

function getSuggestAnswerHTML(questionID, questionType) {
    return `
            <div id="question-${questionID}-suggest-answer" class="suggest-answer content-frame border rounded">
                <div class="answer-body row align-items-center">
                    <div class="col">
                        <div id="suggest-answer-form">
                            <div class="row">
                                <div class="col"><input type="text" id="question-${questionID}-suggest-answer-text" class="form-control" placeholder="Suggest an answer" required></div>
                                <div class="col-sm-auto"><button title="Answer Question" class="btn dark" onclick="answerQuestion(${questionID}, ${questionType})">Answer</button></div>
                            </div>
                            <div class="row"><div class="col error-message" id="question-${questionID}-suggest-answer-error-message"></div></div>
                        </div>
                    </div>
                </div>
            </div>
            `
}//end of getSuggestAnswerHTML

//using AJAX, request to change starredAnswer to answerID OR unstar answer at answerID and display change
function toggleStarredAnswer(questionID, questionType, answerID, starredAnswerID) {
    const currentAnswer = document.getElementById(`answer-${answerID}`)
    const isCurrentlyStarred = answerID === starredAnswerID
    const action = isCurrentlyStarred ? 'unstarAnswer' : 'starAnswer'    //if answer is starred, then toggle to unstar & vice versa
    const URL = `./services/questionService.php?Action=${action}`
    const userData = {questionID: questionID}
    if(!isCurrentlyStarred) { userData.answerID = answerID }  //if trying to star answer, add answerID to data sent to backend

    $.post(URL, userData, function(data) {
        data = JSON.parse(data);
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") { //if post was successful: star/unstar current answer
                const answerList = document.getElementById(`question-${questionID}-answerlist`)
                if(!starredAnswerID) {  //no answer is starred: star current answer, remove "suggested answer" form
                    //remove suggest answer input
                    const suggestAnswerField = document.getElementById(`question-${questionID}-suggest-answer`)
                    answerList.removeChild(suggestAnswerField)

                    currentAnswer.classList.add("starred")  //add star to current answer
                    setNewStarredAnswerID(questionID, questionType, answerID, starredAnswerID)    //change onclick answerID to reflect change
                    toggleStarIcon(questionType, answerID, isCurrentlyStarred, questionID)    //star current answer
                }
                else if(isCurrentlyStarred) { //if current answer is starred, unstar: remove class from current answer & show suggest answer form
                    currentAnswer.classList.remove("starred")
                    setNewStarredAnswerID(questionID, questionType, answerID, starredAnswerID)    //change onclick answerID to reflect change
                    toggleStarIcon(questionType, answerID, isCurrentlyStarred, questionID)    //unstar current answer

                    //append "suggest answer" form to answer list
                    answerList.innerHTML += getSuggestAnswerHTML(questionID, questionType)
                } else { //else current answer is not starred: find starred answer, remove star & add star to current answer
                    const answerArray = document.getElementsByClassName(`question-${questionID}-answer`)
                    let i = 0
                    let starredAnswerNotFound = true
                    while(starredAnswerNotFound && i < answerArray.length) {
                        const answer = answerArray[i]
                        if(answer.classList.contains("starred")) {  //found starred answer: unstar
                            answer.classList.remove("starred")
                            starredAnswerNotFound = false
                        }
                        i += 1  //increment loop
                    }
                    currentAnswer.classList.add("starred")  //add star to current answer
                    setNewStarredAnswerID(questionID, questionType, answerID, starredAnswerID)    //change onclick answerID to reflect change
                    toggleStarIcon(questionType, starredAnswerID, true, questionID)    //unstar starred answer
                    toggleStarIcon(questionType, answerID, isCurrentlyStarred, questionID)    //star current answer
                }//end of else, find starred answer, remove star & add star to current answer
        }} else showErrorMessage('error-message', URL, data)   //else, backend error: show error message
    })//end of post
    .fail(function() { showErrorMessage('error-message', URL) })
}//end of toggleStarredAnswer

function toggleStarIcon(questionType, answerID, isStarred, questionID) {
    let starIcon = document.getElementById(`answer-${answerID}-star`)
    let addToDictDiv = document.getElementById(`answer-${answerID}-add-to-dict`)
    if(isStarred) {
        starIcon.classList.remove("fas")
        starIcon.classList.add("far")

        addToDictDiv.innerHTML = '' //remove "add to dictionary" button
    }
    else {
        starIcon.classList.remove("far")
        starIcon.classList.add("fas")

        if(questionType !== 3) addToDictDiv.innerHTML = getAddToDictBtnHTML(questionID, answerID)   //if in correct format, add "add to dictionary" button
    }
}   //end of toggleStarIcon

function setNewStarredAnswerID(questionID, questionType, answerID, starredAnswerID) {
    const isCurrentlyStarred = answerID === starredAnswerID
    if(!starredAnswerID) starredAnswerID = answerID //no answer was starred: current answerID is now starredAnswerID
    else if(isCurrentlyStarred) starredAnswerID = null //current answer is starred: change starredAnswerID to null
    else starredAnswerID = answerID //else current answer is not starred: current answerID is now starredAnswerID

    const answerArray = document.getElementsByClassName(`question-${questionID}-answer`)
    $.each(answerArray, function(index, answer) {
        const starButton = answer.childNodes[1].childNodes[1].childNodes[0]
        const currentOnclick = starButton.getAttribute("onclick")   //grab the current toggleStarredAnswer
        const currentAnswerID = parseInt(currentOnclick.split(",")[2])  //grab the third parameter, which is the answerID
        starButton.setAttribute("onclick", `toggleStarredAnswer(${questionID}, ${questionType}, ${currentAnswerID}, ${starredAnswerID})`)
    })
}//end of setNewStarredAnswerID

function answerQuestion(questionID, questionType) {
    const answerErrorMessage = document.getElementById(`question-${questionID}-suggest-answer-error-message`)
    answerErrorMessage.innerHTML = ''   //clear error message
    const answerText = $(`#question-${questionID}-suggest-answer-text`).val()
    if(answerPassedErrorCheck(answerText, answerErrorMessage)) {
        const answerRole = roleFromSession === "instructor" ? 1 : 2
        const URL = `./services/questionService.php?Action=uploadAnswer`
        const userData = {
            questionID: questionID,
            answerText: answerText,
            answerEmail: emailFromSession,
            answerRole: answerRole
        }
        //using AJAX, add answer to DB. If role === instructor, then remove input field
        //else, allow student to add more than one answer
        $.post(URL, userData, function(data) {
            data = JSON.parse(data);
            if(data.hasOwnProperty("message")) {
                if(data.message === "success") {  //if post was successful: star/unstar current answer
                    const answerID = data.answerID
                    const answerName = data.answerName
                    const answerList = document.getElementById(`question-${questionID}-answerlist`)
                    const starredAnswerID = answerRole === 1 ? answerID : undefined    //if instructor posted answer, automatically star answer

                    //remove suggest answer input field so inputted answer is at the bottom
                    const suggestAnswerField = document.getElementById(`question-${questionID}-suggest-answer`)
                    answerList.removeChild(suggestAnswerField)

                    //add answer to bottom of answer list
                    const answer = getAnswerHTML(roleFromSession, questionID, questionType, starredAnswerID, answerID, answerText, answerName)
                    answerList.innerHTML += answer

                    //if student, you need to be able to add more than one comment, so add input field back in
                    if(answerRole === 2) {
                        const suggestAnswerFieldHTML = getSuggestAnswerHTML(questionID, questionType)
                        answerList.innerHTML += suggestAnswerFieldHTML
                    }
                }} else showErrorMessage('error-message', URL, data)   //else, backend error: show error message
        })//end of post
        .fail(function() {
            document.getElementById('error-message').innerHTML = `Error, could not connect! Please try to answer at a later time. URL: ${URL}`
        })
    }//end of if(answerPassedErrorCheck)
}//end of answerQuestion

function answerPassedErrorCheck(answer, answerErrorMessage) {
    if($.trim(answer) === '') {//error: password(s) filled with spaces
        answerErrorMessage.innerHTML = "Please fill out this field"
        return false    //answer did not pass error checking
    }
    return true //answer passsed error checking!
}

function setNewQuestionDropDown(forumHTMLID, askQuestionErrorMsgId) {
    let select = $("#question-type-select")
    const URL = './services/questionService.php?Action=getQuestionTypes'
    $.get(URL, {}, function(data) {
        data = JSON.parse(data)
        if(!(data.hasOwnProperty("error") || data.length === 0)) {    //if post was successful, set question dropdown
            const optionListHTML = getQuestionTypeOptions(data)
            select.append(optionListHTML)   //append html to select
            select.select2({    //initialize as select2 markup
                dropdownParent: $("#ask-question"),
                width: '100%'
            })
        } else showErrorMessage(askQuestionErrorMsgId, URL, data)   //else, backend error: show error message
    })
    .fail(function() { showErrorMessage(askQuestionErrorMsgId, URL) })
}//end of setNewQuestionDropDown

function getQuestionTypeOptions(questionTypeData) {
    let optionListHTML = ''
    $.each(questionTypeData, function(index, questionData) { //for each questionType, add option to the dropdown
        const questionType = questionData.questionType
        const questionText = String(questionData.questionText)
        let optionText = ''
        if(questionText.toLowerCase() === "other") optionText = questionText
        else {
            const questionTextSet = parseQuestionTypeText(questionText, '||')
            const questionTextStart = questionTextSet.startText
            const questionTextEnd = questionTextSet.endText

            optionText = `${questionTextStart} "___" ${questionTextEnd}`
        }
        optionListHTML += `<option value="${questionType}">${optionText}</option>`  //add option to option list
    })  //end of for each answer in question

    return optionListHTML
}

function parseQuestionTypeText(questionText,splitString) {
    const questionTextArray = questionText.split(splitString)
    return ({startText: questionTextArray[0], endText: questionTextArray[1]})
}

function setAddQuestionToDictionaryDropdown(classroomID) {
    const errorMsgId = 'add-to-dict-error-message'
    let select = $("#dictionary-select")
    const URL = './services/dictionaryService.php?Action=list'
    $.get(URL, {classroomID: classroomID}, function(data) {
        const dictionaryIDNameSet = getDictionaryIdNameSet(data)

        if(dictionaryIDNameSet.dictionaryIdArray.length === 0) {  //classroom doesn't have dictionaries, allow user to add one
            document.getElementById(errorMsgId).innerHTML = 'No Dictionaries in Classroom. Add one now.<br>'
            document.getElementById(errorMsgId).innerHTML += `<button class="btn dark" onclick="window.location.href = './addDictionary.php'">Add a Dictionary</button>`
        } else {    //classroom has dictionaries, show dictionaries in dropdown
            const optionListHTML = getDictionaryOptions(dictionaryIDNameSet)
            select.append(optionListHTML)   //append html to select
            select.select2({    //initialize as select2 markup
                dropdownParent: $("#add-to-dict"),
                width: '100%'
            })
        }
    })
    .fail(function() { showErrorMessage(errorMsgId, URL) })
}//end of setAddQuestionToDictionaryDropdown

function displayQuestionInput() {
    const questionField = document.getElementById("ask-question-field")
    let selectedQuestion = document.getElementById("question-type-select")
    const selectedQuestionText = selectedQuestion.options[selectedQuestion.selectedIndex].text
    if(selectedQuestion.value === "") questionField.innerHTML = ''   //if no question type selected, don't show input field
    else {  //else, question type selected: construct question text field and show input field
        let questionTextStart = ''
        let questionTextEnd = ''
        if(selectedQuestionText.toLowerCase() !== "other") {   //if selected question type is not other, show unique question format
            const questionTextSet = parseQuestionTypeText(selectedQuestionText, '"___"')
            questionTextStart = questionTextSet.startText
            questionTextEnd = questionTextSet.endText
        }   //else, "other" question type is just a lonely input field

        //create question text field and input field
        questionField.innerHTML = `
            <div class="row align-items-start">
                <div id="question-text-start" class="col-sm-auto">${questionTextStart}</div>
                <div class="col"><input id="questionTerm" type="text" name="questionTerm" required></div>
                <div id="question-text-end" class="col-sm-auto">${questionTextEnd}</div>
            </div>`
    }//end of else, question type selected: construct question text field and show input field
}//end of displayQuestionInput

function uploadQuestion(forumHTMLID, errorMsgId) {
    const questionType = document.getElementById("question-type-select").value
    const questionTerm = document.getElementById("questionTerm").value
    const URL = `./services/questionService.php?Action=uploadQuestion`
    const questionRole = roleFromSession === "instructor" ? 1 : 2

    const userData = {
        classroomID: classroomIDFromSession,
        questionType: questionType,
        questionText: questionTerm,
        questionEmail: emailFromSession,
        questionRole: questionRole
    }
    $.post(URL, userData, function(data) {  //send AJAX request to add question to forum
        data = JSON.parse(data);
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, show new question in forum
                const questionID = data.questionID
                const questionName = data.questionName
                addNewQuestionToForum(forumHTMLID, questionID, questionType, questionName, questionTerm)
                document.getElementById('questionTerm').innerHTML = ''  //clear questionTerm to prepare for adding more questions
        }} else showErrorMessage(errorMsgId, URL, data)   //else, backend error: show error message
    })//end of post
    .fail(function() { showErrorMessage(errorMsgId, URL) })

}

function addNewQuestionToForum(forumHTMLID, questionID, questionType, questionName, questionTerm) {
    const questionTextStart = document.getElementById("question-text-start").innerHTML
    const questionTextEnd = document.getElementById("question-text-end").innerHTML
    const questionText = `${questionTextStart} "${questionTerm}" ${questionTextEnd}`

    //construct HTML for question
    let questionHTML = getOpeningQuestionHTML(questionID, questionText, questionName)
    questionHTML += getSuggestAnswerHTML(questionID, questionType)
    questionHTML += getClosingQuestionHTML()

    $(`#${forumHTMLID}`).prepend(questionHTML)  //add new question HTML to top of forum

    questionCount += 1

    let magicGrid = new MagicGrid({
        container: '#forum',
        gutter: 30,
        static: false,
        items: questionCount
    })

    magicGrid.positionItems();  //reposition items
    magicGrid.listen(); //listen for changes in window size

    $('#ask-question').modal('hide')  //hide modal
}//end of addNewQuestionToForum

$(function() {
    const classroomID = classroomIDFromSession
    const forumHTMLID = 'forum'
    const askQuestionErrorMsgId ='ask-question-error-message'

    setForumHeader();
    displayForum(forumHTMLID, classroomID)
    setNewQuestionDropDown(forumHTMLID, askQuestionErrorMsgId)
    if(roleFromSession === 'instructor') setAddQuestionToDictionaryDropdown(classroomID)

    //hijack ask question form to upload question to db & show in forum
    let askQuestionForm = $('#ask-question-form')
    askQuestionForm.submit(function (event) {
        event.preventDefault()
        uploadQuestion(forumHTMLID, askQuestionErrorMsgId)
    })
})