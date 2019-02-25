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
    .fail(function() {
        document.getElementById(forumHTMLID).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}//end of displayForum

//parse data and create HTML for the questions in the forum
function getForumHTML(data) {
    const role = roleFromSession
    let unStarredQuestionsHTML = ''
    let starredQuestionsHTML = ''

    //for each question, get question data & answer(s) data & fill into the HTML
    $.each(data, function(index, questionData) {
        const questionID = questionData.questionID
        const questionText = questionData.questionText
        const questionName = role === "instructor" ? questionData.questionName : "Anonymous"  //instructors can see names, students cannot

        let questionHTML = getOpeningQuestionHTML(questionID, questionText, questionName)   //create the beginning HTML for the question

        $.each(questionData.answerArray, function(index, answerData) { //for each answer, create HTML according to user role & star status
            const answerID = answerData.answerID
            const starredAnswerID = questionData.starredAnswer
            const answerText = answerData.answerText
            const answerName = answerData.hasOwnProperty("answerName") ? answerData.answerName : undefined

            const answerHTML = getAnswerHTML(role, questionID, starredAnswerID, answerID, answerText, answerName)

            questionHTML += answerHTML
        })  //end of for each answer in question

        //if no starred answer, allow user to suggest their own answer
        if(questionData.starredAnswer === null) questionHTML += getSuggestAnswerHTML(questionID)

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

function getAnswerHTML(role, questionID, starredAnswerID, answerID, answerText, answerName = false) {
    let starButtonHTML = ''
    let answerNameHTML = ''
    let addStarredClass = ''
    let addToDictionaryButtonHTML = ''

    if(role === 'instructor') { //instructors can view names, star questions and add question-answer pair to a dictionary
        starButtonHTML = `<div class="col col-sm-auto"><button class="btn btn-sm" title="Click to star answer" onclick="toggleStarredAnswer(${questionID}, ${answerID}, ${starredAnswerID})"><i id="answer-${answerID}-star" class="far fa-star"></i></button></div>`
        answerNameHTML = answerName ? `<div class="answer-name" class="row"><div class="col">${answerName}</div></div>` : ''    //if there's no answerName, then don't create HTML for it
        if(answerID === starredAnswerID) {  //if answer is starred, change HTML accordingly
            addStarredClass = 'starred'  //add 'starred' class to change styling of answer
            starButtonHTML = starButtonHTML.replace('Click to star answer', 'Click to unstar answer')   //change button title to reflect toggle
            starButtonHTML = starButtonHTML.replace('far', 'fas')   //change the star icon from a outlined star to a solid one, indicating starred status
            addToDictionaryButtonHTML = `<div class="col col-sm-auto"><button class="btn btn-sm" title="Add to Dictionary" onclick="addQuestionToDictionary(${questionID})"><i class="fas fa-plus"></i></button></div>`
        }
    }   //else, role === student: don't show any star HTML or answer names

    return `        <div id="answer-${answerID}" class="question-${questionID}-answer ${addStarredClass} answer content-frame border rounded">
                        <div class="answer-body row align-items-center">
                            ${starButtonHTML}
                            ${addToDictionaryButtonHTML}
                            <div class="col">
                                <div class="row answer-text"><div class="col">${answerText}</div></div>
                                ${answerNameHTML}
                            </div>
                        </div>
                    </div>`
}//end of getAnswerHTML

function addQuestionToDictionary(questionID) {
    const errorMsgId = 'add-to-dict-error-message'
    const selectHTMLId = 'dictionary-select'

    hideGoToDictionaryBtn()
    $('#add-to-dict').modal('show')

    //user confirmed add: add question to dictionary and delete question from forum
    $(`#submit-add-to-dict`).on( 'click', function () {
        let selectData = $(`#${selectHTMLId}`).select2('data')  //get data from select markup
        const dictionaryID = selectData[0].id
        const dictionaryName = selectData[0].text

        const URL = './services/dictionaryService.php?Action=singleAdd'
        const userData = {  //todo: 1) is the action correct? 2) is that all the data i have to send?
            dictionaryID: dictionaryID,
            questionID: questionID
        }
        $.post(URL, userData, function(data) {
            data = JSON.parse(data)
            if(data.hasOwnProperty("msg")) {
                //if post was successful, delete question from forum & show button to go to dictionary
                if(data.message === "success") {
                    deleteQuestionAndShowGoToDictionaryButton(questionID, dictionaryID, dictionaryName, errorMsgId)
                }} else {   //else, backend error: show error message
                const errorMsg = data.hasOwnProperty("error") ? data.error : data
                document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
            }
        })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
    })
}//end of addQuestionToDictionary

function getSuggestAnswerHTML(questionID) {
    return `
            <div id="question-${questionID}-suggest-answer" class="suggest-answer content-frame border rounded">
                <div class="answer-body row align-items-center">
                    <div class="col">
                        <div id="suggest-answer-form">
                            <div class="row">
                                <div class="col"><input type="text" id="question-${questionID}-suggest-answer-text" class="form-control" placeholder="Suggest an answer" required></div>
                                <div class="col-sm-auto"><button title="Answer Question" class="btn dark" onclick="answerQuestion(${questionID})">Answer</button></div>
                            </div>
                            <div class="row"><div class="col error-message" id="question-${questionID}-suggest-answer-error-message"></div></div>
                        </div>
                    </div>
                </div>
            </div>
            `
}//end of getSuggestAnswerHTML

//using AJAX, request to change starredAnswer to answerID OR unstar answer at answerID and display change
function toggleStarredAnswer(questionID, answerID, starredAnswerID) {
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
                if(starredAnswerID === null) {  //no starred answer for question: star answer, remove "suggested answer" form
                    //remove suggest answer input
                    const suggestAnswerField = document.getElementById(`question-${questionID}-suggest-answer`)
                    answerList.removeChild(suggestAnswerField)

                    currentAnswer.classList.add("starred")  //add star to current answer
                    toggleStarIcon(answerID, isCurrentlyStarred)
                }
                else if(isCurrentlyStarred) { //if current answer is starred, unstar: remove class from current answer & show suggest answer form
                    currentAnswer.classList.remove("starred")
                    toggleStarIcon(answerID, isCurrentlyStarred)

                    //append "suggest answer" form to answer list
                    answerList.innerHTML += getSuggestAnswerHTML(questionID)
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
                    toggleStarIcon(answerID, isCurrentlyStarred)
                }//end of else, find starred answer, remove star & add star to current answer
        }} else {    //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById('error-message').innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }//end of else, post was successful: star/unstar current answer
    })//end of post
    .fail(function() {
        document.getElementById('error-message').innerHTML = `Error, could not connect! URL: ${URL}`
    })
}//end of toggleStarredAnswer

function toggleStarIcon(answerID, isStarred) {
    let starIcon = document.getElementById(`answer-${answerID}-star`)
    if(isStarred) {
        starIcon.classList.remove("fas")
        starIcon.classList.add("far")
    }
    else {
        starIcon.classList.remove("far")
        starIcon.classList.add("fas")
    }
}   //end of toggleStarIcon

function answerQuestion(questionID) {
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
                    const answer = getAnswerHTML(roleFromSession, questionID, starredAnswerID, answerID, answerText, answerName)
                    answerList.innerHTML += answer

                    //if student, you need to be able to add more than one comment, so add input field back in
                    if(answerRole === 2) {
                        const suggestAnswerFieldHTML = getSuggestAnswerHTML(questionID)
                        answerList.innerHTML += suggestAnswerFieldHTML
                    }
                }} else {    //else, backend error: show error message
                const errorMsg = data.hasOwnProperty("error") ? data.error : data
                document.getElementById('error-message').innerHTML = `Error! ${errorMsg}. URL: ${URL}`
            }   //end of else, backend error: show error message
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
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, set question dropdown
                const optionListHTML = getQuestionTypeOptions(data)
                select.append(optionListHTML)   //append html to select
                select.select2()    //initialize as select2 markup
            }} else {   //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(askQuestionErrorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }
    })
    .fail(function() {
        document.getElementById(askQuestionErrorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
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
    let select = $("#add-to-dict")
    const URL = './services/dictionaryService.php?Action=list'
    $.get(URL, {classroomID: classroomID}, function(data) {
        const dictionaryIDNameSet = getDictionaryIdNameSet(data)

        if(dictionaryIDNameSet.dictionaryIdArray.length === 0) {  //classroom doesn't have dictionaries, allow user to add one
            document.getElementById(errorMsgId).innerHTML = 'No Dictionaries in Classroom. Add one now.<br>'
            document.getElementById(errorMsgId).innerHTML += `<button class="btn dark" onclick="window.location.href = './addDictionary.php'">Add a Dictionary</button>`
        } else {    //classroom has dictionaries, show dictionaries in dropdown
            const optionListHTML = getDictionaryOptions(dictionaryIDNameSet)
            select.append(optionListHTML)   //append html to select
            select.select2()    //initialize as select2 markup
        }
    })
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}//end of setAddQuestionToDictionaryDropdown

function deleteQuestionAndShowGoToDictionaryButton(questionID, dictionaryID, dictionaryName, errorMsgId) {
    const URL = './services/questionService.php?Action=singleDelete'    //todo: 1) is the action correct? 2) is that all the data i have to send?
    $.post(URL, {questionID: questionID}, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("msg")) {
            //if post was successful, delete question from forum & show button to go to dictionary
            if(data.message === "success") {
                showGoToDictionaryBtn(dictionaryID, dictionaryName, `Term was added to ${dictionaryName}!`)
            }} else {   //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }
    })
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })
}//end of deleteQuestionAndShowGoToDictionaryButton

function hideGoToDictionaryBtn() {
    let goToDictBtn = document.getElementById("go-to-dict-btn")
    goToDictBtn.innerHTML = ''

    document.getElementById("add-to-dict-success-message").innerHTML = ''   //clear success message
}

function showGoToDictionaryBtn(dictionaryID, dictionaryName, successMessage = '') {
    let goToDictBtn = document.getElementById("go-to-dict-btn")
    const userData = {
        dictionaryID:dictionaryID,
        dictionaryName: dictionaryName
    }
    goToDictBtn.innerHTML = `<button class="btn dark" onclick="addToSession(${userData}, 'goTo', './dictionary.php')">Go to Dictionary</button>`
    goToDictBtn.style.display = 'block'

    document.getElementById("add-to-dict-success-message").innerHTML = successMessage
}

function getDictionaryOptions(dictionaryIDNameSet) {
    const dictionaryIDArray = dictionaryIDNameSet.dictionaryIdArray
    const dictionaryNameArray = dictionaryIDNameSet.dictionaryNameArray
    let optionListHTML = ''

    $.each(dictionaryIDArray, function(i, v) {
        optionListHTML += `<option value="${dictionaryIDArray[i]}">${dictionaryNameArray[i]}</option>`  //add option to option list
    })

    return optionListHTML
}

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
                addNewQuestionToForum(forumHTMLID, questionID, questionName, questionTerm)
        }} else {    //else, backend error: show error message
            const errorMsg = data.hasOwnProperty("error") ? data.error : data
            document.getElementById(errorMsgId).innerHTML = `Error! ${errorMsg}. URL: ${URL}`
        }   //end of else, backend error: show error message
    })//end of post
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })

}

function addNewQuestionToForum(forumHTMLID, questionID, questionName, questionTerm) {
    const questionTextStart = document.getElementById("question-text-start").innerHTML
    const questionTextEnd = document.getElementById("question-text-end").innerHTML
    const questionText = `${questionTextStart} "${questionTerm}" ${questionTextEnd}`

    //construct HTML for question
    let questionHTML = getOpeningQuestionHTML(questionID, questionText, questionName)
    questionHTML += getSuggestAnswerHTML(questionID)
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