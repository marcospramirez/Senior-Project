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

        case "getQuestionTypes":
            getQuestionTypeIdsAction();
            break;

        case "no action":
            noAction();
            break;

        case "addQuestionToDictionary":
            addQuestiontoDictionary($conn);
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
            //$questionName = $_POST["questionName"];
            $questionRole = $_POST["questionRole"];

            $table = $questionRole == "1" ? "Instructor" : "Student";

            $getNameSql = "SELECT name from $table where email = '$questionEmail'";

            $name;
            $nameResults = $conn->query($getNameSql);
            while($nameRow = $nameResults->fetch_assoc()){
                $name = $nameRow["name"];
            }

            $insertQuestion = "INSERT into Question (questionType, questionText, questionEmail, questionName, classroomID) VALUES ('$questionType', '$questionText', '$questionEmail', '$name', '$classroomID')";

        }
        catch(Exception $e){
            echo json_encode(array("error" => $e->getMessage()));

        }
        
        if($conn->query($insertQuestion)){
            $lastQuestionnserted = $conn->insert_id;
            echo(json_encode(array("message" => "success", "questionID" => $lastQuestionnserted, "questionName" => "$name")));

        }
        else{
            echo(json_encode(array("error" => "error uploading question")));        
        }

        

    }

    function uploadAnswerAction($conn){
        try{

            $questionID = $_POST["questionID"];
            $answerText = $_POST["answerText"];
            $answerEmail = $_POST["answerEmail"];
            //$answerName = $_POST["answerName"];
            $answerRole = $_POST["answerRole"];

            $table = $answerRole == "1" ? "Instructor" : "Student";

            $getNameSql = "SELECT name from $table where email = '$answerEmail'";

            $name;
            $nameResults = $conn->query($getNameSql);
            while($nameRow = $nameResults->fetch_assoc()){
                $name = $nameRow["name"];
            }

           
            $insertAnswer = "INSERT into Answer (questionID, answerText, answerEmail, answerName, answerRole) VALUES ('$questionID', '$answerText', '$answerEmail', '$name', '$answerRole')";

        }
        catch(Exception $e){
            echo json_encode(array("error" => $e->getMessage()));

        }

        if($conn->query($insertAnswer)){
            $lastAnswerInserted = $conn->insert_id;
            
            if($answerRole == "1"){
                
                starAnswerAction($conn, $lastAnswerInserted); 
            }
                
            echo(json_encode(array("message" => "success", "answerID" => $lastAnswerInserted, "answerName" => $name)));
        }
        else{
            echo(json_encode(array("error" => "error uploading question")));        
        }


    }

    function starAnswerAction($conn, $answerID = null){

        $isSoloStarAction = false;
        if($answerID == null){
            $answerID = $_POST["answerID"];
            $isSoloStarAction = true;
        }

        $questionID = $_POST["questionID"];

        $updateQuestionWithStarredAnswer = "UPDATE Question SET Question.starredAnswer = '$answerID' WHERE Question.questionID = '$questionID'";

        if($isSoloStarAction){
            if($conn->query($updateQuestionWithStarredAnswer)){
                echo json_encode(array("message" => "success"));
            }
            else{
                echo json_encode(array("error" => "error uploading question"));      
            }
        }else{
            $conn->query($updateQuestionWithStarredAnswer);
        }
       
    }

    function unstarAnswerAction($conn){
        $questionID = $_POST["questionID"];

        $unstarAnswerforQuestion = "UPDATE Question SET Question.starredAnswer = 0 WHERE Question.questionID = '$questionID'";

        if($conn->query($unstarAnswerforQuestion)){
            echo json_encode(array("message" => "success"));
        }
        else{
           echo json_encode(array("error" => "error uploading question"));      
        }
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

    function getQuestionTypeIdsAction(){
        
        $returnArray = [];
        $returnArray[] = array("questionType" => 1, "questionText" => '&iquest;C&oacute;mo se dice || en espa&ntilde;ol?');
        $returnArray[] = array("questionType" => 2, "questionText" =>  "&iquest;Qu&eacute; significa ||?");
        $returnArray[] = array("questionType" =>3, "questionText" => "Other");

        echo json_encode($returnArray);
    }

    function addQuestiontoDictionary($conn){
        try{
            $questionID = $_POST["questionID"];
            $dictionaryID = $_POST["dictionaryID"];

            $questionResults = $conn->query("SELECT questionType, questionText, starredAnswer from Question where questionID = '$questionID'");

            if ($questionResults->num_rows > 0){

                while($question = $questionResults->fetch_assoc()){
                    $questionType = $question["questionType"];
                    $questionText = $question["questionText"];

                    $answerID = $question["starredAnswer"];

                }
            }
            else{
                 echo json_encode(array("error" => "no question found"));
                 die();
            }

            $answerResults = $conn->query("SELECT answerText from Answer where answerID = '$answerID'");

            while ($answer = $answerResults->fetch_assoc()) {
                 $answerText = $answer["answerText"];
            }
           

            $sql = "";
            if($questionType == '1'){
                //questionText is english
                //answerText is spanish

                $sql = "INSERT INTO Entry (entryText, entryDefinition, entryAudioPath) VALUES ('$answerText' , '$questionText', '')";
            }
            else if($questionType == '2'){
                //questionText is spanish
                //answerText is english

                $sql = "INSERT INTO Entry (entryText, entryDefinition, entryAudioPath) VALUES ('$questionText' , '$answerText', '')";
            }
            else{
                echo json_encode(array("error" => "Custom question cannot be added to dictionary", "questionType" => $questionType));
            }

            if($sql == ""){
                echo json_encode(array("error" => "Question Type not defined", "questionType" => $questionType));
                die();
            }
            if($conn->query($sql)){
                $lastID = $conn->insert_id;

                $conn->query("INSERT INTO entryToDictionary (dictionaryID, entryID) VALUES ('$dictionaryID','$lastID')");


                $conn->query("DELETE From Question where questionID = '$questionID'");
                $conn->query("DELETE from Answer where questionID = '$questionID'");



                echo json_encode(array("message" => "success"));

            }
            else{
                echo json_encode(array("error" => "error inserting question", "sql" => $sql));
            }


        }
        catch(Exception $e){
            echo json_encode(array("error" => $e->getMessage()));

        }

    }





?>