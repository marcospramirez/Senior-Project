<?php
    require_once("./db.php");

    $conn = returnConnection();

    $questionServiceAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";


    switch ($questionServiceAction) {
        case "list":
            listAction($conn);
            break;

        case "uploadQuestion":
            uploadQuestionAction($conn);
            break;

        case "uploadAnswer":
            uploadAnswerAction($conn);
            break;

        case "starAnswer":
            starAnswerAction($conn);
            break;
        case "unstarAnswer":
            unstarAnswerAction($conn);
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

    function listAction($conn){

        if(isset($_GET['classroom'])){
            $classroomID = $_GET['classroom'];
        }

        $returnQuestions = [];

        $selectQuestions = "SELECT * from Question where classroomID = '$classroomID' ORDER BY questionID DESC" ;
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

    function uploadQuestionAction($conn){

        try{
            $classroomID = $_POST["classroomID"];
            $questionType = $_POST["questionType"];
            $questionText = $_POST["questionText"];
            $questionEmail = $_POST["questionEmail"];
            $questionName = $_POST["questionName"];
           
            $insertQuestion = "INSERT into Question (questionType, questionText, questionEmail, questionName, classroomID) VALUES ('$questionType', '$questionText', '$questionEmail', '$questionName', '$classroomID')";

        }
        catch(Exception $e){
            $retval = array("error" => $e->getMessage());
            echo json_encode($retVal);

        }
        
        if($conn->query($insertQuestion)){
            $retval = array("message" => "success");
        }
        else{
            $retVal = array("error" => "error uploading question");        
        }

        echo json_encode($retVal);

    }

    function uploadAnswerAction($conn){
        try{

            $questionID = $_POST["questionID"];
            $answerText = $_POST["answerText"];
            $answerEmail = $_POST["answerEmail"];
            $answerName = $_POST["answerName"];
            $answerRole = $_POST["answerRole"];

           
            $insertAnswer = "INSERT into Answer (questionID, answerText, answerEmail, answerName, answerRole) VALUES ('$questionID', '$answerText', '$answerEmail', '$answerName', '$answerRole')";

        }
        catch(Exception $e){
            $retval = array("error" => $e->getMessage());
            echo json_encode($retVal);

        }

        if($conn->query($insertAnswer)){

            if($answerRole == 1){
                $lastAnswerInserted = $conn->insert_id;
                starAnswerAction($conn, $lastAnswerInserted); 
            }
                
            $retval = array("message" => "success");
        }
        else{
            $retVal = array("error" => "error uploading question");        
        }

        echo json_encode($retVal);


    }

    function starAnswerAction($conn, $answerID = null){

        if($answerID == null){
            $answerID = $_POST["answerID"];
        }

        $questionID = $_POST["questionID"];

        $updateQuestionWithStarredAnswer = "UPDATE Question SET Question.starredAnswer = '$answerID' WHERE Question.questionID = '$questionID'";

        if($conn->query($updateQuestionWithStarredAnswer)){
            $retval = array("message" => "success");
        }
        else{
            $retVal = array("error" => "error uploading question");      
        }
        echo json_encode($retVal);

    }

    function unstarAnswerAction($conn){
        $questionID = $_POST["questionID"];

        $unstarAnswerforQuestion = "UPDATE Question SET Question.starredAnswer = 0 WHERE Question.questionID = '$questionID'";

        if($conn->query($unstarAnswerforQuestion)){
            $retval = array("message" => "success");
        }
        else{
            $retVal = array("error" => "error uploading question");      
        }
        echo json_encode($retVal);
    }

    function transformQuestion($question){

        $questionText = $question["questionText"];
        $questionType = $question["questionType"];
        $newText;

        switch ($questionType) {
            case 1:
                $newText = '&iquest;C&oacute;mo se dice &quot;' . $questionText . '&quot; en espa&ntilde;ol?';
                break;
            case 2:
                $newText = "&iquest;Qu&eacute; significa &quot;" . $questionText . "&quot;?";
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