<?php
    require_once("./db.php");

    $conn = returnConnection();

    $questionServiceAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";

    if(isset($_GET['classroom'])){
        $classroomID = $_GET['classroom'];
    }

    switch ($questionServiceAction) {
        case "list":
            listAction($conn, $classroomID);
            break;

        case "uploadQuestion":
            uploadQuestionAction($conn, $classroomID);
            break;

        case "uploadAnswer":
            uploadAnswerAction($conn, $classroomID);
            break;

        case "starAnswer":
            starAnswerAction($conn, $classroomID);
            break;

        case "no action":
            noAction();
            break;

        default:
            noAction();
            break;
    
    }

    closeConnection($conn);

    function noAction(){
        $retVal = array("error" => "no action error");
        echo json_encode($retVal);
    }

    function listAction($conn, $classroomID ){

        $returnQuestions = [];

        $selectQuestions = "SELECT * from Question where classroomID = '$classroomID'";
        $questions = $conn->query($selectQuestions);

        if ($questions->num_rows > 0){
            while($question = $questions->fetch_assoc()){
                
                $questionID = $question["questionID"];
                $selectAnswers = "SELECT * from Answer where questionID = '$questionID'";

                $answers = $conn->query($selectAnswers);
                $questionObject = transformQuestion($question);

                $questionObject['answerArray'] = [];
                
                while($answer = $answers->fetch_assoc()){
                    $questionObject["answerArray"][]= transformAnswer($answer);
                }

                $returnQuestions[] = $questionObject;
            }
        }

        header('Content-Type: text/html; charset=utf-8');
        echo json_encode($returnQuestions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    }

    function uploadQuestionAction($conn, $classroomID ){
        
    }

    function uploadAnswerAction($conn, $classroomID ){
        
    }

    function starAnswerAction($conn, $classroomID ){
        
    }

    function transformQuestion($question){

        $questionText = $question["questionText"];
        $questionType = $question["questionType"];
        $newText;

        switch ($questionType) {
            case 1:
                $newText = 'Como se dice &quot;' . $questionText . '&quot; en espanol?';
                break;
            case 2:
                $newText = "Que significa " . $questionText . "?";
                break;
            case 3:
                $newText = $questionText;
                break;
            default:
                $newText = $questionText;
                break;
        }

        $question["questionText"] = $newText;

        $question["starredAnswer"] == 0 ? $question["starredAnswer"] = null : $question["starredAnswer"] = $question["starredAnswer"];

        return $question;

    }

    function transformAnswer($answer){

        $answerRole = $answer["answerRole"];

        switch ($answerRole) {
            case 1:
                $answer["answerRole"] = "instructor";
                break;
            case 2:
                $answer["answerRole"] = "student";
            default:
                $answer["answerRole"] = $answer["answerRole"];
                break;
        }

        return $answer;

    }





?>