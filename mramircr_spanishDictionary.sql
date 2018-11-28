-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 25, 2018 at 06:01 PM
-- Server version: 5.7.24
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

--
-- Dumping data for table `Dictionary`
--

INSERT INTO `Dictionary` (`dictionaryID`, `dictionaryName`) VALUES
(1, 'Test'),
(2, 'Saludos y expresiones de cortesia');

-- --------------------------------------------------------

--
-- Table structure for table `Entry`
--

CREATE TABLE `Entry` (
  `entryID` int(11) NOT NULL,
  `entryText` varchar(140) NOT NULL,
  `entryDefinition` varchar(280) NOT NULL,
  `entryAudioPath` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Entry`
--

INSERT INTO `Entry` (`entryID`, `entryText`, `entryDefinition`, `entryAudioPath`) VALUES
(1, 'perro', 'Dog', 'test.audio'),
(2, 'test', 'Enter the translation', '447474__pax11__beat43-90bpm.wav'),
(3, 'test', 'Enter the translation', '447474__pax11__beat43-90bpm.wav'),
(4, 'test', 'Enter the translation', ''),
(5, '', '', ''),
(6, 'Buenos días. Buenas tardes, Buenas noches. (Muy) Buenas.', 'Good morning. Good afternoon/evening. Good night. Very good.', ''),
(7, 'Hola. ¿Qué tal? ¿Cómo estás? ¿Cómo está?', 'Hi. How\'s it going? How are you?', ''),
(8, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(9, '¿Y tú? ¿Y usted?', 'And you? And yourself?', ''),
(10, 'Adiós. Hasta mañana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(11, '¿Cómo te llamas? ¿Cómo se llama usted?', 'What is your name? What\'s your name?(formal/polite)', ''),
(12, 'What is your name? What\'s your name?(formal/polite)', 'Where are you from? Where are you from?(formal/polite). (I\'m from) _____.', ''),
(13, 'señor (Sr.), señora (Sra.), señorita (Srta.)', 'Mister (Mr.), Misses (Mrs.), Miss (Ms.)', ''),
(14, 'profesor, profesora', 'Professor', ''),
(15, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(16, 'Hola', 'Hello', ''),
(17, 'Red', 'Rojo', ''),
(18, 'Blue', 'Azul', '');

-- --------------------------------------------------------

--
-- Table structure for table `entryToDictionary`
--

CREATE TABLE `entryToDictionary` (
  `dictionaryID` int(11) NOT NULL,
  `entryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `entryToDictionary`
--

INSERT INTO `entryToDictionary` (`dictionaryID`, `entryID`) VALUES
(1, 1),
(1, 4),
(2, 6),
(2, 7),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(1, 16),
(1, 17),
(1, 18);

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
-- Table structure for table `Student`
--

CREATE TABLE `Student` (
  `email` varchar(80) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `studentToClassroom`
--

CREATE TABLE `studentToClassroom` (
  `studentEmail` varchar(80) NOT NULL,
  `classroomID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

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
-- Indexes for table `Instructor`
--
ALTER TABLE `Instructor`
  ADD PRIMARY KEY (`email`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Classroom`
--
ALTER TABLE `Classroom`
  MODIFY `classID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Dictionary`
--
ALTER TABLE `Dictionary`
  MODIFY `dictionaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Entry`
--
ALTER TABLE `Entry`
  MODIFY `entryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `studentToClassroom`
--
ALTER TABLE `studentToClassroom`
  ADD CONSTRAINT `classroomIDconstraint` FOREIGN KEY (`classroomID`) REFERENCES `Classroom` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentemailConstraint` FOREIGN KEY (`studentEmail`) REFERENCES `Student` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
