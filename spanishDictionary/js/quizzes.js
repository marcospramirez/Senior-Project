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
                    quizHTML += '<div id="multiple-choice">'

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

            quizHTML += "<input type='submit' value='submit quiz'>"
            quizHTML += "</form>"

            $("#quizHolder").html(quizHTML);


             $("#quizForm").submit(function(e){
                e.preventDefault();

                let quiz = $(this).serialize();
                console.log(quiz);
                $("#quizHolder").slideUp();

                let gradeURL = 'services/quizService.php?Action=gradeQuiz&classroomID=' + classroomIDFromSession;
                $.post(gradeURL, quiz, function(data) {
                    console.log("success");
                });

            });

        })
        .fail(function() {
           //console.log("error");
        })
    });




});