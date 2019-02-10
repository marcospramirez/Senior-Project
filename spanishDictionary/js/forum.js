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
    //todo: only give me data that is pertinent to the user role, aka, don't give me names if student
    const userData = {
        Action: 'list',
        classroom: classroomID
    }
    $.get(URL, userData, function(data) {
        //todo: do error checking/if get error message from backend
        data = JSON.parse(data) //parse data from string to JSON

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
            const isCurrentlyStarred = true
            starButtonHTML = `<button class="btn btn-sm" onclick="toggleStarredAnswer(${questionID}, ${answerID}, ${isCurrentlyStarred})"><i class="fas fa-star"></i></button>`
            answerNameHTML = answerName === null ? '' : `<div class="answer-name" class="row"><div class="col">${answerName}</div></div>`    //if there's no answerName, then don't show HTML for it
        }
    } else if(role == "instructor") {    //if instructor, show unstarred button next to answer
        const isStarred = false
        starButtonHTML = `<button class="btn btn-sm" onclick="toggleStarredAnswer(${questionID}, ${answerID}, ${isStarred})"><i class="far fa-star"></i></button>`

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
                        <div id=suggest-answer-form">
                            <div class="row">
                                <div class="col"><input type="text" id="question-${questionID}-suggest-answer-text" class="form-control" placeholder="Suggest an answer" required></div>
                                <div class="col-sm-auto"><button class="btn dark" onclick="answerQuestion(${questionID})">Answer</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
}//end of getSuggestAnswerHTML

//using AJAX, request to change starredAnswer to answerID OR unstar answer at answerID and display change
function toggleStarredAnswer(questionID, answerID, isCurrentlyStarred) {
    const currentAnswer = document.getElementById(`answer-${answerID}`)
    const action = isCurrentlyStarred ? 'unstarAnswer' : 'starAnswer'    //if answer is starred, then toggle to unstar & vice versa
    const URL = `./services/questionService.php?Action=${action}`
    const userData = {questionID: questionID}
    if(!isCurrentlyStarred) { userData.answerID = answerID }  //if trying to star answer, add answerID to data sent to backend

    $.post(URL, userData, function(data) {
        if(data.hasOwnProperty("message") && data.message === "success") {  //if post was successful: star/unstar current answer
            //remove star
            if(isCurrentlyStarred) { //if current answer is starred, remove class from current answer
                currentAnswer.classList.remove("starred")
            } else { //else, find starred answer, remove star & add star to current answer
                const answerArray = document.getElementsByClassName(`question-${questionID}-answer`)
                let i = 0
                let starredAnswerNotFound = true
                while(starredAnswerNotFound) {
                    const answer = answerArray[i]
                    if(answer.classList.contains("starred")) answer.classList.remove("starred")
                    starredAnswerNotFound = false
                }
                currentAnswer.classList.add("starred")  //add star to current answer
            }//end of else, find starred answer, remove star & add star to current answer

            currentAnswer.innerHTML = ''    //clear suggest-answer input field
        } else {    //else, backend error: show error message
            window.alert(`Error! ${data.error}. URL: ${URL}`)
        }//end of else, post was successful: star/unstar current answer
    })//end of post
    .fail(function() {
        window.alert(`Error, could not connect! URL: ${URL}`)
    })
}//end of toggleStarredAnswer

function answerQuestion(questionID) {
    const answerText = $(`#question-${questionID}-suggest-answer-text`).val()
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
        if(data.hasOwnProperty("message") && data.message === "success") {  //if post was successful: star/unstar current answer
            //fixme: got back answerID & answerName
            const answerID = ''
            const answerName = ''
            const question = document.getElementById(`question-${questionID}`)
            const starredAnswerID = answerRole === 1 ? answerID : undefined    //if instructor posted answer, automatically star answer

            //remove suggest answer input field so inputted answer is at the bottom
            const suggestAnswerField = document.getElementById(`question-${questionID}-suggest-answer`)
            question.removeChild(suggestAnswerField)

            //add answer to bottom of question
            const answer = getAnswerHTML(roleFromSession, questionID, starredAnswerID, answerID, answerText, answerName)
            question.innerHTML += answer

            //if student, you need to be able to add more than one comment, so add input field back in
            if(answerRole === 2) {
                const suggestAnswerFieldHTML = getSuggestAnswerHTML(questionID)
                question.innerHTML += suggestAnswerFieldHTML
            }
        } else {    //else, backend error: show error message
            window.alert(`Error! ${data.error}. URL: ${URL}`)
        }   //end of else, backend error: show error message
        })//end of post
    .fail(function() {
        window.alert(`Error, could not connect! Please try to answer at a later time. URL: ${URL}`)
    })

}//end of answerQuestion

function setNewQuestionDropDown(forumHTMLID, askQuestionErrorMsgId) {
    let select = document.getElementById("question-type-select")
    let selectedQuestionType = select.value
    //todo: make sure that this null thing works like I want it to v
    if(selectedQuestionType === "") {   //if no question type selected then show error message & hide dropdown
        document.getElementById(askQuestionErrorMsgId).innerHTML = `Error, could not set dropdown!`
        select.style.display = "none"   //hide select dropdown
    } else {  //questionType is valid: add options to select html
        const URL = './services/questionService.php?Action=TBD'  //todo: add actual action
        const userData = {}     //todo: add actual userData, probably won't need any though lol
        $.get(URL, userData, function(data) {
            //todo: do backend error checking/else: not correct response show error message
            const optionListHTML = getQuestionTypeOptions(data)
            select.innerHTML += optionListHTML
        })
        .fail(function() {
            document.getElementById(askQuestionErrorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
    }
}//end of setNewQuestionDropDown

function getQuestionTypeOptions(data) {
    let optionListHTML = ''
    const questionTypeArray = JSON.parse(data)
    $.each(questionTypeArray, function(index, questionTypeData) { //for each questionType, add option to the dropdown
        const questionType = questionTypeData.questionType
        const questionText = String(questionTypeData.questionText)
        let optionText = ''
        if(questionText.toLowerCase() === "other") optionText = questionText    //todo: make sure that "other" is correct lol
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
        questionEmail: emailFromSession
        questionRole: questionRole
    }
    $.post(URL, userData, function(data) {  //send AJAX request to add question to forum
        //todo: do backend error checking/else: not correct response show error message
        if(data.hasOwnProperty("message") && data.message === "success") {  //if post was successful, show new question in forum
            //todo: get questionID & questionName from data
            const questionID = ''
            const questionName = ''
            addNewQuestionToForum(forumHTMLID, questionID, questionName, questionTerm)
        } else {    //else, backend error: show error message
            document.getElementById(errorMsgId).innerHTML = `Error! ${data.error}. URL: ${URL}`
        }   //end of else, backend error: show error message
    })//end of post
    .fail(function() {
        document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
    })

}

function addNewQuestionToForum(forumHTMLID, questionID, questionName, questionTerm) {
    const questionTextStart = document.getElementById("question-text-start").value
    const questionTextEnd = document.getElementById("question-text-end").value
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


}

$(function() {
    const classroomID = classroomIDFromSession
    const forumHTMLID = 'forum'
    const askQuestionErrorMsgId ='ask-question-error-message'

    setForumHeader();
    displayForum(forumHTMLID, classroomID)
    setNewQuestionDropDown(forumHTMLID, askQuestionErrorMsgId)

    //hijack filter form to display filtered table
    let askQuestionForm = $('#ask-question-form')
    askQuestionForm.submit(function (event) {
        event.preventDefault()
        uploadQuestion(forumHTMLID, askQuestionErrorMsgId)
    })

})