$(document).ready(function(){

    $("#tags-select").select2({
        ajax: {
            url: 'services/dictionaryService.php?Action=tags',
            dataType: 'json'
        },
        placeholder: 'Tags',
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
        const URL = 'services/quizService.php?Action=generateQuiz&classroomID=' + classroomIDFromSession;
        $.get(URL, formData, function(data) {
           $("#form-holder").slideUp();

           let quizHolder = $("#quiz");

           let quizData = JSON.parse(data);
           let quizHTML = "<form id='quizForm'>"
           quizData.forEach(quizSection=>{
                let questionFormat = quizSection.questionFormat;
                //console.log(questionFormat);
                switch(questionFormat) {
                  case "matching":
                    let matchingEntries = quizSection.entries;
                    let matchingDefinitions = quizSection.definitions;

                    quizHTML += "<div id='matching'>";

                    matchingEntries.forEach(entry =>{
                        

                        quizHTML += "<div>"
                        quizHTML += `<label>${entry}</label>`
                        quizHTML += `<input type="hidden" name="matching-entry[]" value="${entry}">` 
                        quizHTML += `<select name="matching-for[${entry}]">`

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
                    quizHTML += '<div id="multiple-choice">'

                    multipleChoiceQuestions.forEach(question =>{
                        let label = question["definition"];

                        let choices = question["choices"];

                        quizHTML += "<div>";
                        quizHTML += '<label>' + label +'</label>';
                        quizHTML += `<input type="hidden" value = "${label}">`; 
                        quizHTML += '<div>';
                        choices.forEach(choice =>{

                            quizHTML += '<input type="radio" id="multipleChoice' + label + '-' + choice + '" name="multipleChoice[' + label + ']" value="' + choice +'">';
                            quizHTML += '<label for="multipleChoice-' + label + '-' + choice + '">' + choice + '</label>';
                            
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

            quizHTML += "<input type='submit' value='submit quiz'>"
            quizHTML += "</form>"

            $("#quizHolder").html(quizHTML);


             $("#quizForm").submit(function(e){
                e.preventDefault();

                let quiz = $(this).serialize();
                console.log(quiz);
                $("#quizHolder").slideUp();

                let gradeURL = 'services/quizService.php?Action=gradeQuiz&classroomID=' + classroomIDFromSession;
                $.get(gradeURL, quiz, function(data) {
                    console.log("success");
                });

            });

        })
        .fail(function() {
           //console.log("error");
        })
    });




});