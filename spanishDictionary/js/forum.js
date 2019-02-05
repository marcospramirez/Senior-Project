function setForumHeader() {
    const classroomName = classroomNameFromSession
    //update title to reflect classroom name
    document.title = `${classroomName} Forum`
    //update header to reflect classroom name
    document.getElementById('forum-header').innerHTML = `<h1>${classroomName} Forum</h1>`
}
function displayForum(data, forumID) {
    let forumHTML = null
    let questionCount = null
    if(data.length == 0) {
        forumHTML = '<div><h2 style="text-align: center;">No Questions in Forum.</h2></div>'
        let questionCount = 1
    } else {
        forumHTML = getForumHTML(data)
        questionCount = data.length
    }

    document.getElementById(forumID).innerHTML = forumHTML

    let magicGrid = new MagicGrid({
        container: '#forum',
        gutter: 30,
        static: false,
        items: questionCount
    })
    magicGrid.listen();

}

function getForumHTML(data) {
    //parse data and create HTML for the questions
    let forumHTML = ''
    let unansweredQuestionsHTML = ''
    let answeredQuestionsHTML = ''

    //for each question, get question data & answer(s) data & fill into the HTML
    $.each(data, function(index, questionData) {
        let questionName = ''
        if(roleFromSession == "instructor") questionName = questionData.questionName   //instructors can see names
        else questionName = 'Anonymous' //students cannot see names

        let questionHTML = `
        <div class="question content-frame border rounded">
            <div class="question-name" class="row"><div class="col">${questionName} asks...</div></div>
            <div id="question-text" class="row"><div class="col">${questionData.questionText}</div></div>
            <div class="question-body">
                <div class="answer-list">
                    <div class="answer-header" class="row"><div class="col"><h3>Answers:</h3></div></div>
        `
        $.each(questionData.answerArray, function(index, answerData) {
            let starButtonHTML = ''
            let answerNameHTML = ''
            if(roleFromSession == "instructor") {   //instructors can star answers and see names
                if(answerData.answerID === questionData.starredAnswer) starButtonHTML = `<button class="btn btn-sm btn-primary active" onclick="toggleStarredAnswer(${questionData.questionID}, ${answerData.answerID})"><i class="fas fa-star"></i></button>`
                else starButtonHTML = `<button class="btn btn-sm btn-primary" onclick="toggleStarredAnswer(${questionData.questionID}, ${answerData.answerID})"><i class="far fa-star"></i></button>`

                answerNameHTML = `<div class="answer-name" class="row"><div class="col">${answerData.answerName}</div></div>`
            }

            let answerHTML = `
                    <div class="answer content-frame border rounded">
                        <div class="answer-body row align-items-center">
                            <div class="col col-sm-auto">${starButtonHTML}</div>
                            <div class="col">
                                <div id="answer-text" class="row"><div class="col">${answerData.answerText}</div></div>
                                ${answerNameHTML}
                            </div>
                        </div>
                    </div>
        `
            questionHTML += answerHTML
        })  //end of for each answer in question

        if(questionData.starredAnswer === null) {
            questionHTML += `
            <div class="suggest-answer content-frame border rounded">
                <div class="answer-body row align-items-center">
                    <div class="col">
                        <form id=suggest-answer-form">
                            <div class="row">
                                <div class="col"><input type="text" id="answer-input" class="form-control" placeholder="Suggest an answer" required></div>
                                <div class="col-sm-auto"><button class="btn btn-primary" type="submit" name="submit-answer">Answer</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            `
        }

        questionHTML += '</div> </div> </div>'

        if(questionData.starredAnswer === null) unansweredQuestionsHTML += questionHTML
        else answeredQuestionsHTML += questionHTML

    })  //end of for each question

    forumHTML = unansweredQuestionsHTML + answeredQuestionsHTML
    return forumHTML
}

$(function() {
    const classroomID = classroomIDFromSession
    const classroomName = classroomNameFromSession
    const forumID = 'forum'

    setForumHeader();

    const URL = `./services/questionService.php`
    //todo: only give me data that is pertinent to the user role, aka, don't give me names if student
    const userData = {
        Action: 'list',
        classroom: classroomID
    }

    //using AJAX, get list of all questions for the class
    //and display into forum
    $.get(URL, userData, function(data) {
        displayForum(JSON.parse(data), forumID);
    })
        .fail(function() {
            document.getElementById(forumID).innerHTML = `Error, could not connect! URL: ${URL}`
        })


})