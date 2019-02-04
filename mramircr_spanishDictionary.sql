-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 04, 2019 at 06:54 PM
-- Server version: 5.7.25
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mramircr_spanishDictionary`
--

-- --------------------------------------------------------

--
-- Table structure for table `Answer`
--

CREATE TABLE `Answer` (
  `answerID` int(11) NOT NULL,
  `questionID` int(11) NOT NULL,
  `answerName` varchar(80) NOT NULL,
  `answerEmail` varchar(80) NOT NULL,
  `answerRole` int(11) NOT NULL,
  `answerText` varchar(140) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Classroom`
--

CREATE TABLE `Classroom` (
  `classID` int(11) NOT NULL,
  `className` varchar(40) NOT NULL,
  `instructorEmail` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `classroomToDictionary`
--

CREATE TABLE `classroomToDictionary` (
  `classID` int(11) NOT NULL,
  `dictionaryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Dictionary`
--

CREATE TABLE `Dictionary` (
  `dictionaryID` int(11) NOT NULL,
  `dictionaryName` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Entry`
--

CREATE TABLE `Entry` (
  `entryID` int(11) NOT NULL,
  `entryText` varchar(140) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entryDefinition` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entryAudioPath` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `entryToDictionary`
--

CREATE TABLE `entryToDictionary` (
  `dictionaryID` int(11) NOT NULL,
  `entryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `entryToPersonalVocabList`
--

CREATE TABLE `entryToPersonalVocabList` (
  `personalVocabID` int(11) NOT NULL,
  `entryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `entryToTag`
--

CREATE TABLE `entryToTag` (
  `tagID` int(11) NOT NULL,
  `entryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Instructor`
--

CREATE TABLE `Instructor` (
  `email` varchar(80) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PersonalVocabList`
--

CREATE TABLE `PersonalVocabList` (
  `personalVocabID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Question`
--

CREATE TABLE `Question` (
  `questionID` int(11) NOT NULL,
  `questionType` int(11) NOT NULL,
  `questionText` varchar(140) NOT NULL,
  `starredAnswer` int(11) NOT NULL,
  `classroomID` int(11) NOT NULL,
  `questionEmail` varchar(80) NOT NULL,
  `questionName` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Student`
--

CREATE TABLE `Student` (
  `email` varchar(80) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `name` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `studentToClassroom`
--

CREATE TABLE `studentToClassroom` (
  `studentEmail` varchar(80) NOT NULL,
  `classroomID` int(11) NOT NULL,
  `personalVocabID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Tag`
--

CREATE TABLE `Tag` (
  `tagID` int(11) NOT NULL,
  `tagText` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Answer`
--
ALTER TABLE `Answer`
  ADD PRIMARY KEY (`answerID`),
  ADD KEY `questionID` (`questionID`);

--
-- Indexes for table `Classroom`
--
ALTER TABLE `Classroom`
  ADD PRIMARY KEY (`classID`),
  ADD KEY `instructorEmail` (`instructorEmail`);

--
-- Indexes for table `classroomToDictionary`
--
ALTER TABLE `classroomToDictionary`
  ADD PRIMARY KEY (`classID`,`dictionaryID`),
  ADD KEY `dictionaryConstraint` (`dictionaryID`);

--
-- Indexes for table `Dictionary`
--
ALTER TABLE `Dictionary`
  ADD PRIMARY KEY (`dictionaryID`);

--
-- Indexes for table `Entry`
--
ALTER TABLE `Entry`
  ADD PRIMARY KEY (`entryID`);

--
-- Indexes for table `entryToDictionary`
--
ALTER TABLE `entryToDictionary`
  ADD PRIMARY KEY (`dictionaryID`,`entryID`),
  ADD KEY `entryID` (`entryID`);

--
-- Indexes for table `entryToPersonalVocabList`
--
ALTER TABLE `entryToPersonalVocabList`
  ADD KEY `entryConstraint` (`entryID`),
  ADD KEY `vocablistconstraint` (`personalVocabID`);

--
-- Indexes for table `entryToTag`
--
ALTER TABLE `entryToTag`
  ADD PRIMARY KEY (`tagID`,`entryID`),
  ADD KEY `entryIDConstraint` (`entryID`);

--
-- Indexes for table `Instructor`
--
ALTER TABLE `Instructor`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `PersonalVocabList`
--
ALTER TABLE `PersonalVocabList`
  ADD PRIMARY KEY (`personalVocabID`);

--
-- Indexes for table `Question`
--
ALTER TABLE `Question`
  ADD PRIMARY KEY (`questionID`);

--
-- Indexes for table `Student`
--
ALTER TABLE `Student`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `studentToClassroom`
--
ALTER TABLE `studentToClassroom`
  ADD PRIMARY KEY (`studentEmail`,`classroomID`),
  ADD KEY `classroomIDconstraint` (`classroomID`);

--
-- Indexes for table `Tag`
--
ALTER TABLE `Tag`
  ADD PRIMARY KEY (`tagID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Answer`
--
ALTER TABLE `Answer`
  MODIFY `answerID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Classroom`
--
ALTER TABLE `Classroom`
  MODIFY `classID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Dictionary`
--
ALTER TABLE `Dictionary`
  MODIFY `dictionaryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Entry`
--
ALTER TABLE `Entry`
  MODIFY `entryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PersonalVocabList`
--
ALTER TABLE `PersonalVocabList`
  MODIFY `personalVocabID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Question`
--
ALTER TABLE `Question`
  MODIFY `questionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Tag`
--
ALTER TABLE `Tag`
  MODIFY `tagID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Answer`
--
ALTER TABLE `Answer`
  ADD CONSTRAINT `questionID` FOREIGN KEY (`questionID`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Classroom`
--
ALTER TABLE `Classroom`
  ADD CONSTRAINT `emailConstraint` FOREIGN KEY (`instructorEmail`) REFERENCES `Instructor` (`email`);

--
-- Constraints for table `classroomToDictionary`
--
ALTER TABLE `classroomToDictionary`
  ADD CONSTRAINT `classroomConstraint` FOREIGN KEY (`classID`) REFERENCES `Classroom` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dictionaryConstraint` FOREIGN KEY (`dictionaryID`) REFERENCES `Dictionary` (`dictionaryID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `entryToDictionary`
--
ALTER TABLE `entryToDictionary`
  ADD CONSTRAINT `dictionaryIDconstraint` FOREIGN KEY (`dictionaryID`) REFERENCES `Dictionary` (`dictionaryID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entryID` FOREIGN KEY (`entryID`) REFERENCES `Entry` (`entryID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `entryToPersonalVocabList`
--
ALTER TABLE `entryToPersonalVocabList`
  ADD CONSTRAINT `entryConstraint` FOREIGN KEY (`entryID`) REFERENCES `Entry` (`entryID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vocablistconstraint` FOREIGN KEY (`personalVocabID`) REFERENCES `PersonalVocabList` (`personalVocabID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `entryToTag`
--
ALTER TABLE `entryToTag`
  ADD CONSTRAINT `entryIDConstraint` FOREIGN KEY (`entryID`) REFERENCES `Entry` (`entryID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tagIDConstraint` FOREIGN KEY (`tagID`) REFERENCES `Tag` (`tagID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studentToClassroom`
--
ALTER TABLE `studentToClassroom`
  ADD CONSTRAINT `classroomIDconstraint` FOREIGN KEY (`classroomID`) REFERENCES `Classroom` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentemailConstraint` FOREIGN KEY (`studentEmail`) REFERENCES `Student` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
