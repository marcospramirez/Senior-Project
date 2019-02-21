function setForumHeader() {
    const classroomName = classroomNameFromSession
    //update title to reflect classroom name
    document.title = `${classroomName} Forum`
    //update header to reflect classroom name
    document.getElementById('forum-header').innerHTML = `<h1>${classroomName} Forum</h1>`
}

let questionCount = null
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
            let forumHTML = null
            if(data.length == 0) {
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
    let unStarredQuestionsHTML = ''
    let starredQuestionsHTML = ''

    //for each question, get question data & answer(s) data & fill into the HTML
    $.each(data, function(index, questionData) {
        const questionID = questionData.questionID
        const questionText = questionData.questionText
        const questionName = roleFromSession == "instructor" ? questionData.questionName : "Anonymous"  //instructors can see names, students cannot

        let questionHTML = getQuestionOpenHTML(questionID, questionText, questionName)

        $.each(questionData.answerArray, function(index, answerData) { //for each answer, print according to user role & star status
            const answerID = answerData.answerID
            const starredAnswerID = questionData.starredAnswer
            const answerText = answerData.answerText
            const answerName = answerData.hasOwnProperty("answerName") ? answerData.answerName : undefined

            const answerHTML = getAnswerHTML(roleFromSession, questionID, starredAnswerID, answerID, answerText, answerName)

            questionHTML += answerHTML
        })  //end of for each answer in question

        //if no starred answer, allow user to suggest their own answer
        if(questionData.starredAnswer === null) questionHTML += getSuggestAnswerHTML(questionID)

        questionHTML += getQuestionCloseHTML()

        //if question has been starred, add to the end of the forum
        //else, add to the beginning of the forum
        if(questionData.starredAnswer === null) unStarredQuestionsHTML += questionHTML
        else starredQuestionsHTML += questionHTML

    })  //end of for each question

    const forumHTML = unStarredQuestionsHTML + starredQuestionsHTML //forum ordered by unstarred questions first

    return forumHTML
}

function getQuestionOpenHTML(questionID, questionText, questionName) {
    return `
        <div id="question-${questionID}" class="question content-frame border rounded">
            <div class="question-name" class="row"><div class="col">${questionName} asks...</div></div>
            <div id="question-text" class="row"><div class="col">${questionText}</div></div>
            <div class="question-body">
                <div id="question-${questionID}-answerlist" class="answer-list">
                    <div class="answer-header" class="row"><div class="col"><h3>Answers:</h3></div></div>
        `
}//end of getQuestionOpenHTML

function getQuestionCloseHTML() {
    return '</div> </div> </div>'
}

function getAnswerHTML(role, questionID, starredAnswerID, answerID, answerText, answerName = null) {
    let starButtonHTML = ''
    let isStarredClass = ''
    let answerNameHTML = ''
    if(answerID === starredAnswerID) {    //current answer is the starred answer
        isStarredClass = 'starred' //add starred class to answer to change styling
        if(role == "instructor") {   //if instructor, see star button & names in forum
            starButtonHTML = `<button class="btn btn-sm" onclick="toggleStarredAnswer(${questionID}, ${answerID}, ${starredAnswerID})"><i id="answer-${answerID}-star" class="fas fa-star"></i></button>`
            answerNameHTML = answerName === null ? '' : `<div class="answer-name" class="row"><div class="col">${answerName}</div></div>`    //if there's no answerName, then don't show HTML for it
        }
    } else if(role == "instructor") {    //if instructor, show unstarred button next to answer
        starButtonHTML = `<button class="btn btn-sm" onclick="toggleStarredAnswer(${questionID}, ${answerID}, ${starredAnswerID})"><i id="answer-${answerID}-star" class="far fa-star"></i></button>`

    }   //else, role == student: don't show star buttons

    return `        <div id="answer-${answerID}" class="question-${questionID}-answer ${isStarredClass} answer content-frame border rounded">
                        <div class="answer-body row align-items-center">
                            <div class="col col-sm-auto">${starButtonHTML}</div>
                            <div class="col">
                                <div class="row answer-text"><div class="col">${answerText}</div></div>
                                ${answerNameHTML}
                            </div>
                        </div>
                    </div>`
}//end of getAnswerHTML

function getSuggestAnswerHTML(questionID) {
    return `
            <div id="question-${questionID}-suggest-answer" class="suggest-answer content-frame border rounded">
                <div class="answer-body row align-items-center">
                    <div class="col">
                        <div id="suggest-answer-form">
                            <div class="row">
                                <div class="col"><input type="text" id="question-${questionID}-suggest-answer-text" class="form-control" placeholder="Suggest an answer" required></div>
                                <div class="col-sm-auto"><button class="btn dark" onclick="answerQuestion(${questionID})">Answer</button></div>
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
        const answerRole = roleFromSession == "instructor" ? 1 : 2
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
    if($.trim(answer) == '') {//error: password(s) filled with spaces
        answerErrorMessage.innerHTML = "Please fill out this field"
        return false    //answer did not pass error checking
    }
    return true //answer passsed error checking!
}

function setNewQuestionDropDown(forumHTMLID, askQuestionErrorMsgId) {
    let select = document.getElementById("question-type-select")
    const URL = './services/questionService.php?Action=getQuestionTypes'
    $.get(URL, {}, function(data) {
        data = JSON.parse(data)
        if(data.hasOwnProperty("message")) {
            if(data.message === "success") {    //if post was successful, set question dropdown
                const optionListHTML = getQuestionTypeOptions(data)
                select.innerHTML += optionListHTML
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

function displayQuestionInput() {
    const questionFieldHTMLId = document.getElementById("ask-question-field")
    let selectedQuestion = document.getElementById("question-type-select")
    const selectedQuestionText = selectedQuestion.options[selectedQuestion.selectedIndex].text
    if(selectedQuestion.value === "") questionFieldHTMLId.innerHTML = ''   //if no question type selected, don't show input field
    else {  //else, question type selected: construct question text field and show input field
        let questionTextStart = ''
        let questionTextEnd = ''
        if(selectedQuestionText.toLowerCase() !== "other") {   //if selected question type is not other, show unique question format
            const questionTextSet = parseQuestionTypeText(selectedQuestionText, '"___"')
            questionTextStart = questionTextSet.startText
            questionTextEnd = questionTextSet.endText
        }   //else, "other" question type is just a lonely input field
        //construct question text field and input field
        const questionFieldText = `
            <div class="row align-items-start">
                <div id="question-text-start" class="col-sm-auto">${questionTextStart}</div>
                <div class="col"><input id="questionTerm" type="text" name="questionTerm" required></div>
                <div id="question-text-end" class="col-sm-auto">${questionTextEnd}</div>
            </div>`
        questionFieldHTMLId.innerHTML = questionFieldText  //show text field and input field
    }//end of else, question type selected: construct question text field and show input field
}

function uploadQuestion(forumHTMLID, errorMsgId) {
    const questionType = document.getElementById("question-type-select").value
    const questionTerm = document.getElementById("questionTerm").value
    const URL = `./services/questionService.php?Action=uploadQuestion`
    const questionRole = roleFromSession == "instructor" ? 1 : 2

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
    let questionHTML = getQuestionOpenHTML(questionID, questionText, questionName)
    questionHTML += getSuggestAnswerHTML(questionID)
    questionHTML += getQuestionCloseHTML()

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

    $('#ask-question').modal('hide');  //hide modal
}//end of addNewQuestionToForum

$(function() {
    const classroomID = classroomIDFromSession
    const forumHTMLID = 'forum'
    const askQuestionErrorMsgId ='ask-question-error-message'

    setForumHeader();
    displayForum(forumHTMLID, classroomID)
    setNewQuestionDropDown(forumHTMLID, askQuestionErrorMsgId)

    //hijack ask question form to upload question to db & show in forum
    let askQuestionForm = $('#ask-question-form')
    askQuestionForm.submit(function (event) {
        event.preventDefault()
        uploadQuestion(forumHTMLID, askQuestionErrorMsgId)
    })

})