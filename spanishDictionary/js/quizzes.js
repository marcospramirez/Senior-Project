$(document).ready(function(){

    $( "input[name='quizType']" ).change(function() {
        let quizType = $(this).val();

        if(quizType == "dictionary"){
            $(".part2").slideDown();
            $("#alldictionaries").prop("checked", true);

        }
        else{
            $(".part3").slideUp();
            $(".part2").slideUp();
        }
    });
    $( "input[name='dictionaryAmount']" ).change(function() {
        let amount = $(this).val();

        if(amount == "chooseOwn"){
            $(".part3").slideDown();
        }
        else{
            $(".part3").slideUp();
        }
    });

    $("#tags-select").select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags (optional)',
        width: '100%'
    });

    $("#dictionary-select").select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=dictionarySelect&classroomID=' + classroomIDFromSession,
            dataType: 'json'
        },
        placeholder: 'Dictionaries',
        width: '100%'
    });

    $("#quiz-generation-form").submit(function(e){
        e.preventDefault();

        let formData = $(this).serialize();
        //console.log(formData)
        const URL = 'services/quizService.php?Action=generateQuiz&classroomID=' + classroomIDFromSession + "&email=" + emailFromSession;
        $.get(URL, formData, function(data) {


           let quizHolder = $("#quiz");

           let quizData = JSON.parse(data);
           if(quizData.hasOwnProperty("error")) {  //remove filter button and filter modal
                $('#error').html("<h3>Not enough entries to generate quiz, try again!");
            }

            else{
           $("#form-holder").slideUp();
           let quizHTML = "<form id='quizForm'><h1>Quiz</h1>"
           quizData.forEach(quizSection=>{
                let questionFormat = quizSection.questionFormat;
                //console.log(questionFormat);
                switch(questionFormat) {
                  case "matching":
                    let matchingEntries = quizSection.entries;
                    let matchingDefinitions = quizSection.definitions;

                    quizHTML += "<div id='matching'><h3>Matching Questions</h3>";

                    matchingEntries.forEach(entryArray =>{
                        
                        let entry = entryArray["text"];
                        let id = entryArray["id"];

                        quizHTML += "<div>"
                        quizHTML += `<label>${entry}</label>`
                        quizHTML += `<input type="hidden" name="matching-entry[${id}]" value="${entry}">` 
                        quizHTML += `<select name="matching-for[${id}]">`

                        matchingDefinitions.forEach(definition =>{
                            quizHTML += `<option value="${definition}">${definition}</option>`;
                        })

                        quizHTML += "</select>"
                        quizHTML += "</div>"
                    })
                    quizHTML += "</div>";

                    break;
                  case "multiple choice":
                    let multipleChoiceQuestions = quizSection.questions;
                    quizHTML += '<div id="multiple-choice"><h3>Multiple Choice Questions</h3>'

                    multipleChoiceQuestions.forEach(question =>{
                        let questionArray = question["definition"];

                        let label = questionArray["text"];
                        let id = questionArray["id"];

                        let choices = question["choices"];

                        quizHTML += "<div>";
                        quizHTML += '<label>' + label +'</label>';
                        quizHTML += '<div>';
                        choices.forEach(choice =>{

                            quizHTML += '<input type="radio" id="multipleChoice-' + choice.replace(/\s/g,'') + '-' + label.replace(/\s/g,'') +'" name="multipleChoice[' + id + ']" value="' + choice +'">';
                            quizHTML += '<label for="multipleChoice-' + choice.replace(/\s/g,'') + '-' + label.replace(/\s/g,'') + '">' + choice + '</label>';
                            
                        })

                        quizHTML += "</div>";
                        quizHTML += "</div>";
                        
                     })

                    quizHTML += "</div>";

                    break;
                  default:
                    // code block
                }

                
           });

            quizHTML += "<input class='btn' type='submit' value='submit quiz'>"
            quizHTML += "</form>"

            $("#quizHolder").html(quizHTML).slideDown();




             $("#quizForm").submit(function(e){
                e.preventDefault();

                let quiz = $(this).serialize();
                console.log(quiz);
                $("#quizHolder").slideUp();

                let gradeURL = 'services/quizService.php?Action=gradeQuiz&classroomID=' + classroomIDFromSession;
                $.post(gradeURL, quiz, function(data) {
                    gradedQuiz = "<h1>Graded Quiz</h1>"
                    gradedQuiz += "<div id='percentage'></div>";
                    let gradeData = JSON.parse(data);

                    let totalQuestions = 0;
                    let numCorrect = 0;
                    for(x in gradeData){
                        let array = gradeData[x];

                        gradedQuiz += "<div><h3>" + x + "</h3>";

                        for(i in array){
                            let item = array[i];
                            if(item["isCorrect"] == true){
                                gradedQuiz += "<div class='correct'>";
                                gradedQuiz += item["question"] + " : " + item["yourAnswer"];
                                numCorrect ++; 
                            }
                            else{
                                gradedQuiz += "<div class='incorrect'>";
                                gradedQuiz += item["question"] + "<br/>Your Answer: <span class='yourAnswer'>" + item["yourAnswer"] + "</span>";
                                gradedQuiz += "<br/>Correct Answer: " + item["correctAnswer"];
                            }


                            gradedQuiz += "</div>"

                            totalQuestions ++;
                        }

                        gradedQuiz += "</div>";

                    }

                    gradedQuiz += "<h3>Final Score</h3>";
                    gradedQuiz += numCorrect + " / " + totalQuestions;

                    let percentage = numCorrect / totalQuestions * 100;


                   $("#gradedQuizHolder").html(gradedQuiz).slideDown(); 
                   $("#percentage").html(percentage.toFixed(2)  + "%");
                });

            });

            }
        })

        .fail(function() {
           //console.log("error");
        })
    });




});