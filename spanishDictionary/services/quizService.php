<?php
    require_once("./db.php");

    $conn = returnConnection();

    $quizServiceAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";


    switch ($quizServiceAction) {
        case "generateQuiz":
            generateQuiz($conn);
            break;

        case "gradeQuiz":
            gradeQuiz($conn);
            break;

        case "no action":
            noAction();
            break;

        default:
            noAction();
            break;
    
    }

    closeConnection($conn);

function gradeQuiz($conn){
    try {
        $classroomID = $_GET["classroomID"];
        $matching = $_POST["matching-entry"];
        $matchingAnswers = $_POST["matching-for"];
        $response = [];

        $matchingResponse = [];
        foreach ($matching as $matchID => $tomatch) {
            
            $matchanswer = $matchingAnswers[$matchID];

            //sql
            $getEntrySQL = "SELECT entryText, entryDefinition from Entry where entryID = '$matchID'";

            $realEntry = $conn->query($getEntrySQL)->fetch_assoc();

            $realEntryDefinition = $realEntry["entryDefinition"];

            if($realEntryDefinition == $matchanswer){
                $isCorrect = true;
            }
            else{
                $isCorrect = false;
            }
           
            $singleMatch = array("question" => $tomatch, "yourAnswer" => $matchanswer, "correctAnswer" => $realEntryDefinition, "isCorrect" => $isCorrect);

            $matchingResponse[] = $singleMatch;

        }

        $response["matching"] = $matchingResponse;

        if(isset($_POST["multipleChoice"])){
          $multipleChoice = $_POST["multipleChoice"];  
        }
        else{
            $multipleChoice = [];
        }
        
        $multipleChoiceResponse = [];
        foreach ($multipleChoice as $id => $answer) {
            
            //sql to determine
            $getEntrySQL = "SELECT entryText, entryDefinition from Entry where entryID = '$id'";
            $realEntry = $conn->query($getEntrySQL)->fetch_assoc();

            $realEntryText = $realEntry["entryText"];

            if($realEntryText == $answer){
                $isCorrect = true;
            }
            else{
                $isCorrect = false;
            }

            $question = $realEntry["entryDefinition"];

            $singleMultipleChoice = array("question" => $question, "yourAnswer" => $answer, "correctAnswer" => $realEntryText, "isCorrect" => $isCorrect);

            $multipleChoiceResponse[] = $singleMultipleChoice;
        }

        $response["multiple choice"] = $multipleChoiceResponse;

        echo json_encode($response);

    } catch (Exception $e) {
        echo json_encode(array("error" => $e->getMessage()));
    }
}
function generateQuiz($conn){
	$sql;
	try{
		$classroomID = $_GET["classroomID"];
		$generateType = $_GET["quizType"];

		//Dictionary vs Vocab List
		if($generateType == "dictionary"){
			$allDictionariesorChoose = $_GET["dictionaryAmount"];
			if($allDictionariesorChoose == "alldictionaries"){
				$sql = "SELECT Entry.entryID, Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath FROM Entry INNER JOIN entryToDictionary USING (entryID) where dictionaryID in (SELECT Dictionary.dictionaryID from Dictionary, classroomToDictionary WHERE classroomToDictionary.classID = '$classroomID' and classroomToDictionary.dictionaryID = Dictionary.dictionaryID) ";
			}
			else{ //dictionaries Chosen
				$dictionaryIDs = $_GET["dictionarySelect"];

				if(!is_array($dictionaryIDs)){
					$dictionaryIDs = [$dictionaryIDs];
				}

				$allDictionaryIDs = implode(',' , $dictionaryIDs);

				$sql = "SELECT Entry.entryID, Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath FROM Entry INNER JOIN entryToDictionary USING (entryID) where dictionaryID in (" . $allDictionaryIDs . ") ";
			}
		}
        else{
            //vocab list
            $email = $_GET["email"];

            $sql = "SELECT Entry.entryID, Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath FROM Entry where entryID in (SELECT entryID from entryToPersonalVocabList, studentToClassroom where studentToClassroom.studentEmail = '$email' and studentToClassroom.classroomID = '$classroomID' and entryToPersonalVocabList.personalVocabID = studentToClassroom.personalVocabID)";
        }

		if(isset($_GET["tags"])){
			
			$tags = $_GET['tags'];
			
			if(!is_array($tags)) {
            	$tags = [$tags];
        	}

        	$allTags = implode(',' , $tags);

        	$sql .= " and entryID in (SELECT entryID from entryToTag where tagID in ('$allTags')";


		}

		$sql .= " ORDER BY RAND()";
	}
	catch(Exception $e){
        echo json_encode(array("error" => $e->getMessage()));

    }

    $returnQuestions = [];

    $matching = $sql .= " LIMIT 8";
    
    $matchingQuestions = array();
    $matchingQuestions["questionFormat"] = "matching";
    $matchingEntries = [];
    $matchingDefinitions = [];
    
    $result = $conn->query($matching);
    $noMathching = false;
    if ($result->num_rows > 2){
        while($row = $result->fetch_assoc()){
            $matchingEntries[]= array("text" => $row["entryText"], "id"=> $row["entryID"]);
            $matchingDefinitions[] = $row["entryDefinition"];
        }

        shuffle($matchingEntries);
        shuffle($matchingDefinitions);

        $matchingQuestions["entries"] = $matchingEntries;
        $matchingQuestions["definitions"] = $matchingDefinitions;

        $returnQuestions[] = $matchingQuestions;
    }
    else{
        $noMathching = true;
    }


    $multipleChoice = $sql;
    $multipleChoiceQuestions = [];
    $multipleChoiceQuestions["questionFormat"] = "multiple choice";

    $index = 0;

    $definitions = [];
    $answers = [];
    $falseAnswers = [];

    $result = $conn->query($multipleChoice);
    $noMultipleChoice = false;
    if($result->num_rows > 4){
    	while($row = $result->fetch_assoc()){

    		$falseAnswers[] = $row["entryText"];

    		if($index < 5){
    			$definitions[$index] = array("text" => $row["entryDefinition"], "id" => $row["entryID"]);
    			$answers[$index] = array($row["entryText"]);//setting as array so I can add random choices to it later
    		}

    		$index ++;
    	}

    	shuffle($falseAnswers);

    	foreach ($answers as $i => $answerArray) {

    		$k = rand(0, count($falseAnswers) - 1);

    		while(count($answerArray) < 4){
    			if(!in_array($falseAnswers[$k], $answerArray)){
    				$answerArray[] = $falseAnswers[$k];
    			}

    			$k = rand(0, count($falseAnswers) - 1);
    		}

            shuffle($answerArray);

    		$answers[$i] = $answerArray;
    	}

    	$multiplechoicereturn= array();
    	foreach ($definitions as $i => $definition) {
    		$questionArray = array("definition" => $definition, "choices" => $answers[$i]);

    		$multiplechoicereturn[] = $questionArray;
    	}

    	$multipleChoiceQuestions["questions"] = $multiplechoicereturn;

    	$returnQuestions[] = $multipleChoiceQuestions;

    	
    	    
    }

    else{
        $noMultipleChoice = true;
    }

    if($noMultipleChoice && $noMathching){
         echo json_encode(array("error" => "not enough entries"));
    }
    else{
        header('Content-Type: text/html; charset=utf-8');
        echo json_encode($returnQuestions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}


    function noAction(){
        $retVal = array("error" => "no action error");
        echo json_encode($retVal);
    }


	





