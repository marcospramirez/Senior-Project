<?php
    require_once("./db.php");

    $conn = returnConnection();

    $quizServiceAction = isset($_GET['Action']) ? $_GET['Action'] : "no action";


    switch ($quizServiceAction) {
        case "generateQuiz":
            generateQuiz($conn);
            break;

        case "no action":
            noAction();
            break;

        default:
            noAction();
            break;
    
    }

    closeConnection($conn);

function generateQuiz($conn){
	$sql;
	try{
		$classroomID = $_GET["classroomID"];
		$generateType = $_GET["quizType"];

		//Dictionary vs Vocab List
		if($generateType == "dictionary"){
			$allDictionariesorChoose = $_GET["dictionaryAmount"];
			if($allDictionariesorChoose == "alldictionaries"){
				$sql = "SELECT Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath FROM Entry INNER JOIN entryToDictionary USING (entryID) where dictionaryID in (SELECT Dictionary.dictionaryID from Dictionary, classroomToDictionary WHERE classroomToDictionary.classID = '$classroomID' and classroomToDictionary.dictionaryID = Dictionary.dictionaryID) ";
			}
			else{ //dictionaries Chosen
				$dictionaryIDs = $_GET["dictionarySelect"];

				if(!is_array($dictionaryIDs)){
					$dictionaryIDs = [$dictionaryIDs];
				}

				$allDictionaryIDs = implode(',' , $dictionaryIDs);

				$sql = "SELECT Entry.entryText, Entry.entryDefinition, Entry.entryAudioPath FROM Entry INNER JOIN entryToDictionary USING (entryID) where dictionaryID in (" . $allDictionaryIDs . ") ";
			}
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

    if ($result->num_rows > 2){
        while($row = $result->fetch_assoc()){
            $matchingEntries[]= $row["entryText"];
            $matchingDefinitions[] = $row["entryDefinition"];
        }

        shuffle($matchingEntries);
        shuffle($matchingDefinitions);

        $matchingQuestions["entries"] = $matchingEntries;
        $matchingQuestions["definitions"] = $matchingDefinitions;

        $returnQuestions[] = $matchingQuestions;
    }


    $multipleChoice = $sql;
    $multipleChoiceQuestions = [];
    $multipleChoiceQuestions["questionFormat"] = "multiple choice";

    $index = 0;

    $definitions = [];
    $answers = [];
    $falseAnswers = [];

    $result = $conn->query($multipleChoice);

    if($result->num_rows > 4){
    	while($row = $result->fetch_assoc()){

    		$falseAnswers[] = $row["entryText"];

    		if($index < 5){
    			$definitions[$index] = $row["entryDefinition"];
    			$answers[$index] = array($row["entryText"]);
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

    		$answers[$i] = $answerArray;
    	}

    	$multiplechoicereturn= array();
    	foreach ($definitions as $i => $definition) {
    		$questionArray = array("definition" => $definition, "choices" => $answers[$i]);

    		$multiplechoicereturn[] = $questionArray;
    	}

    	$multipleChoiceQuestions["questions"] = $multiplechoicereturn;

    	$returnQuestions[] = $multipleChoiceQuestions;

    	header('Content-Type: text/html; charset=utf-8');
    	echo json_encode($returnQuestions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    	    
    }



	





}