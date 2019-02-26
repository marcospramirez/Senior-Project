-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 04, 2019 at 06:53 PM
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

--
-- Dumping data for table `Answer`
--

INSERT INTO `Answer` (`answerID`, `questionID`, `answerName`, `answerEmail`, `answerRole`, `answerText`) VALUES
(1, 1, 'testname', 'testEmail', 1, 'testAnswer'),
(2, 1, 'test2name', 'test2email', 2, 'test2'),
(3, 4, 'testing', 'tteeest', 2, 'spicy'),
(4, 4, 'hi', 'hiemail', 2, 'heat');

-- --------------------------------------------------------

--
-- Table structure for table `Classroom`
--

CREATE TABLE `Classroom` (
  `classID` int(11) NOT NULL,
  `className` varchar(40) NOT NULL,
  `instructorEmail` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Classroom`
--

INSERT INTO `Classroom` (`classID`, `className`, `instructorEmail`) VALUES
(1, 'Test Class', 'testteacher@gmail.com'),
(2, 'Test2', 'testteacher@gmail.com'),
(3, 'Mi Primer Clase', 'marcos@test.edu'),
(5, 'SPAN 1101 Fall 2018', 'vickie@stedwards.edu');

-- --------------------------------------------------------

--
-- Table structure for table `classroomToDictionary`
--

CREATE TABLE `classroomToDictionary` (
  `classID` int(11) NOT NULL,
  `dictionaryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `classroomToDictionary`
--

INSERT INTO `classroomToDictionary` (`classID`, `dictionaryID`) VALUES
(1, 9),
(3, 10),
(5, 41),
(5, 42),
(5, 43),
(5, 44),
(5, 45),
(5, 46),
(5, 47),
(5, 48),
(5, 49),
(5, 50),
(5, 51),
(5, 52),
(5, 53),
(5, 54),
(5, 55),
(5, 56),
(5, 57),
(5, 58),
(5, 59),
(5, 60),
(5, 61),
(5, 62),
(5, 63),
(5, 64),
(5, 65),
(5, 66),
(5, 67),
(5, 68),
(5, 69),
(5, 70),
(5, 71),
(5, 72),
(5, 73),
(5, 74),
(5, 75);

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
(2, 'Saludos y expresiones de cortesia'),
(3, 'This is a test'),
(4, 'This is a test'),
(5, 'This is a test'),
(6, 'This is for real'),
(7, 'Demo'),
(8, 'This is a test'),
(9, 'Demo Dictionary'),
(10, 'Colores'),
(11, ''),
(12, 'Colores'),
(13, 'Colores'),
(14, 'test'),
(15, 'pls'),
(16, 'Test'),
(17, 'Testsadfasdfa'),
(18, 'Colors'),
(19, 'Color'),
(20, 'BatB'),
(21, 'Tag Testing'),
(22, 'Tag Testing'),
(23, 'Tag Testing'),
(24, 'Tag Testing'),
(25, 'Tag Testing'),
(26, 'Tag Testing'),
(27, ''),
(28, 'Tag Testing'),
(29, 'Tag Testing'),
(30, 'Tag Testing'),
(31, 'Tag Testing'),
(32, 'Tag Testing'),
(33, 'Tag Testing'),
(34, 'Tag Testing'),
(35, 'Tag Testing'),
(36, 'Tag Testing'),
(37, 'Dictionary 1'),
(38, 'Dictionary 1'),
(39, 'Dictionary 1'),
(40, 'This is a test'),
(41, 'This is a test'),
(42, 'Colores'),
(43, 'Colores'),
(44, 'This is for real'),
(45, 'Demo Dictionary'),
(46, 'Demo Dictionary'),
(47, 'Tag Testing'),
(48, 'Colores'),
(49, 'VY Tag Testing'),
(50, 'MR Tag Filtering'),
(51, 'Tag Testing For REAL'),
(52, 'Tag Testing For REAL'),
(53, 'Tag Testing For REAL'),
(54, 'dzsxvfkj'),
(55, 'dzsxvfkj'),
(56, 'dzsxvfkj'),
(57, 'dzsxvfkj'),
(58, 'dzsxvfkj'),
(59, 'dzsxvfkj'),
(60, 'dzsxvfkj'),
(61, 'dzsxvfkj'),
(62, 'dzsxvfkj'),
(63, 'dzsxvfkj'),
(64, 'dzsxvfkj'),
(65, 'Tag Testing'),
(66, 'Tag Testing'),
(67, 'Tag Testing'),
(68, 'Tag Testing'),
(69, 'Tag Testing'),
(70, 'Tag Testing'),
(71, 'Tag Testing 10000'),
(72, 'Tag Testing 11111'),
(73, 'Tag Testing 1112'),
(74, 'Tag Testing 1112'),
(75, 'Tag Testing 1234235');

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

--
-- Dumping data for table `Entry`
--

INSERT INTO `Entry` (`entryID`, `entryText`, `entryDefinition`, `entryAudioPath`) VALUES
(19, 'Hola', 'Hello', 'hola.mp3'),
(20, 'Adios', 'Goodbye', ''),
(21, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(22, 'Hola', 'Hello', 'hola.mp3'),
(23, 'Adios', 'Goodbye', ''),
(24, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(25, 'Buenos Dias', 'Good Morning', ''),
(26, 'Hola', 'hello', 'test.mp3'),
(27, 'buenos noches', 'good night', ''),
(28, 'tengo hambre', 'I am hungry', 'hungry.mp3'),
(29, 'Rojo', 'red', ''),
(30, '\"Buenos dÃ­as. Buenas tardes', ' Buenas noches. (Muy) Buenas.\"', 'Good morning. Good afternoon/evening. Good night. Very good.'),
(31, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(32, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(33, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(34, 'seÃ±or (Sr.), seÃ±ora (Sra.), seÃ±orita (Srta.)', 'Mister (Mr.), Misses (Mrs.), Miss (Ms.)', ''),
(35, 'profesor, profesora', 'Professor', ''),
(36, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(37, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(38, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(39, 'El saludo', 'Greeting', ''),
(40, 'Array', 'Array', ''),
(41, 'Array', 'Array', ''),
(42, 'YO', 'MOMENT OF TRUTH', 'Grand Piano.wav'),
(43, 'YEs', 'I WORKED', ''),
(44, 'file move', 'pls', 'Grand Piano.wav'),
(45, 'sad', 'Enter the translation', ''),
(46, 'aSA', 'Enter the tsaSanslation', 'Grand Piano.wav'),
(47, '', 'Enter the translation', ''),
(48, 'adsf', 'ASDF', 'Grand Piano.wav'),
(49, '', 'Enter the translation', ''),
(50, 'Rojo', 'red', 'Grand Piano.wav'),
(51, '\"Buenos dÃ­as. Buenas tardes', ' Buenas noches. (Muy) Buenas.\"', 'Good morning. Good afternoon/evening. Good night. Very good.'),
(52, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(53, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(54, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(55, 'seÃ±or (Sr.), seÃ±ora (Sra.), seÃ±orita (Srta.)', 'Mister (Mr.), Misses (Mrs.), Miss (Ms.)', ''),
(56, 'profesor, profesora', 'Professor', ''),
(57, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(58, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(59, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(60, 'El saludo', 'Greeting', ''),
(61, '\"Buenos dÃ­as. Buenas tardes', ' Buenas noches. (Muy) Buenas.\"', 'Good morning. Good afternoon/evening. Good night. Very good.'),
(62, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(63, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(64, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(65, 'seÃ±or (Sr.), seÃ±ora (Sra.), seÃ±orita (Srta.)', 'Mister (Mr.), Misses (Mrs.), Miss (Ms.)', ''),
(66, 'profesor, profesora', 'Professor', ''),
(67, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(68, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(69, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(70, 'El saludo', 'Greeting', ''),
(71, '\"Buenos dÃ­as. Buenas tardes', ' Buenas noches. (Muy) Buenas.\"', 'Good morning. Good afternoon/evening. Good night. Very good.'),
(72, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(73, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(74, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(75, 'seÃ±or (Sr.), seÃ±ora (Sra.), seÃ±orita (Srta.)', 'Mister (Mr.), Misses (Mrs.), Miss (Ms.)', ''),
(76, 'profesor, profesora', 'Professor', ''),
(77, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(78, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(79, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(80, 'El saludo', 'Greeting', ''),
(81, 'Buenos dÃ­as. Buenas tardes', ' Buenas noches. (Muy) Buenas.', 'Good morning. Good afternoon/evening. Good night. Very good.'),
(82, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(83, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(84, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(85, 'seÃ±or (Sr.)', ' seÃ±ora (Sra.)', ' seÃ±orita (Srta.)'),
(86, 'profesor', ' profesora', 'Professor'),
(87, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(88, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(89, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(90, 'El saludo', 'Greeting', ''),
(91, 'Buenos dÃ­as. Buenas tardes', ' Buenas noches. (Muy) Buenas.', 'Good morning. Good afternoon/evening. Good night. Very good.'),
(92, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(93, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(94, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(95, 'seÃ±or (Sr.)', ' seÃ±ora (Sra.)', ' seÃ±orita (Srta.)'),
(96, 'profesor', ' profesora', 'Professor'),
(97, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(98, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(99, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(100, 'El saludo', 'Greeting', ''),
(101, 'Buenos dÃ­as. Buenas tardes', ' Buenas noches. (Muy) Buenas.', 'Good morning. Good afternoon/evening. Good night. Very good.'),
(102, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(103, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(104, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(105, 'seÃ±or (Sr.)', ' seÃ±ora (Sra.)', ' seÃ±orita (Srta.)'),
(106, 'profesor', ' profesora', 'Professor'),
(107, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(108, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(109, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(110, 'El saludo', 'Greeting', ''),
(111, 'Buenos dÃ­as. Buenas tardes.  Buenas noches. (Muy) Buenas.', 'Good morning. Good afternoon/evening. Good night. Very good.', ''),
(112, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(113, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(114, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(115, 'seÃ±or (Sr.).  seÃ±ora (Sra.).  seÃ±orita (Srta.)', 'Mister (Mr.).  Misses (Mrs.).  Miss (Ms.)', ''),
(116, 'profesor/profesora', 'Professor', ''),
(117, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(118, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(119, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(120, 'El saludo', 'Greeting', ''),
(121, 'Buenos dÃ­as. Buenas tardes.  Buenas noches. (Muy) Buenas.', 'Good morning. Good afternoon/evening. Good night. Very good.', ''),
(122, 'Muy bien. Regular. Bien.', 'Fine. OK. Good.', ''),
(123, 'Â¿Y tÃº? Â¿Y usted?', 'And you? And yourself?', ''),
(124, 'AdiÃ³s. Hasta maÃ±ana. Hasta luego. Nos vemos.', 'Good bye. See you tomorrow. See you later. See you.', ''),
(125, 'seÃ±or (Sr.).  seÃ±ora (Sra.).  seÃ±orita (Srta.)', 'Mister (Mr.).  Misses (Mrs.).  Miss (Ms.)', ''),
(126, 'profesor/profesora', 'Professor', ''),
(127, 'Gracias. Muchas gracias.', 'Thanks/Thank you. Thank you very much.', ''),
(128, 'Por favor. PerdÃ³n. (Con) Permiso.', 'Please. Sorry. Excuse Me.', ''),
(129, 'Mucho gusto. Igualmente. Encantado/a', 'Nice to meet you/pleasure is all mine. Likewise. My pleasure.', ''),
(130, 'El saludo', 'Greeting', ''),
(131, 'Hola', 'Hello', 'hola.mp3'),
(132, 'Adios', 'Goodbye', ''),
(133, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(134, 'perro', 'dog', 'perro.mp3'),
(135, 'gato', 'cat', ''),
(136, 'correr', 'to run', ''),
(137, 'Hola', 'Hello', 'hola.mp3'),
(138, 'Adios', 'Goodbye', ''),
(139, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(140, 'perro', 'dog', 'perro.mp3'),
(141, 'gato', 'cat', ''),
(142, 'correr', 'to run', ''),
(143, 'Hola', 'Hello', 'hola.mp3'),
(144, 'Adios', 'Goodbye', ''),
(145, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(146, 'perro', 'dog', 'perro.mp3'),
(147, 'gato', 'cat', ''),
(148, 'correr', 'to run', ''),
(149, 'Hola', 'Hello', 'hola.mp3'),
(150, 'Adios', 'Goodbye', ''),
(151, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(152, 'perro', 'dog', 'perro.mp3'),
(153, 'gato', 'cat', ''),
(154, 'correr', 'to run', ''),
(155, 'Hola', 'Hello', 'hola.mp3'),
(156, 'Adios', 'Goodbye', ''),
(157, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(158, 'perro', 'dog', 'perro.mp3'),
(159, 'gato', 'cat', ''),
(160, 'correr', 'to run', ''),
(161, 'Hola', 'Hello', 'hola.mp3'),
(162, 'Adios', 'Goodbye', ''),
(163, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(164, 'perro', 'dog', 'perro.mp3'),
(165, 'gato', 'cat', ''),
(166, 'correr', 'to run', ''),
(167, 'Hola', 'Hello', 'hola.mp3'),
(168, 'Adios', 'Goodbye', ''),
(169, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(170, 'perro', 'dog', 'perro.mp3'),
(171, 'gato', 'cat', ''),
(172, 'correr', 'to run', ''),
(173, 'Hola', 'Hello', 'hola.mp3'),
(174, 'Adios', 'Goodbye', ''),
(175, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(176, 'perro', 'dog', 'perro.mp3'),
(177, 'gato', 'cat', ''),
(178, 'correr', 'to run', ''),
(179, 'Hola', 'Hello', 'hola.mp3'),
(180, 'Adios', 'Goodbye', ''),
(181, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(182, 'perro', 'dog', 'perro.mp3'),
(183, 'gato', 'cat', ''),
(184, 'correr', 'to run', ''),
(185, 'Hola', 'Hello', 'hola.mp3'),
(186, 'Adios', 'Goodbye', ''),
(187, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(188, 'perro', 'dog', 'perro.mp3'),
(189, 'gato', 'cat', ''),
(190, 'correr', 'to run', ''),
(191, 'Hola', 'Hello', 'hola.mp3'),
(192, 'Adios', 'Goodbye', ''),
(193, 'Bienvenidos', 'Welcome ', 'bienvenidos.mp3'),
(194, 'perro', 'dog', 'perro.mp3'),
(195, 'gato', 'cat', ''),
(196, 'correr', 'to run', ''),
(197, 'adsf', 'dsfghj', 'Grand Piano.wav'),
(198, 'Rojo', 'red', 'Grand Piano.wav'),
(199, 'Rojo', 'red', 'Grand Piano.wav'),
(200, 'sredtfghjk', 'real', 'Grand Piano.wav'),
(201, 'adsf', 'demo', 'Grand Piano.wav'),
(202, 'adsf', 'demo', 'Grand Piano.wav'),
(203, 'adsf', 'fdxgbnhj', 'Grand Piano.wav'),
(204, 'rtyu', 'test', 'Grand Piano.wav'),
(205, 'asdfsd', 'sus', ''),
(206, 'sdfa', 'verbo', 'charjoined.ogg'),
(207, 'adsf', 'sus', ''),
(208, 'sredtfghjk', 'sus', ''),
(209, 'sredtfghjk', 'sus', ''),
(210, 'sredtfghjk', 'sus', ''),
(211, 'test', 'dfsghy', ''),
(212, 'test', 'dfsghy', ''),
(213, 'test', 'dfsghy', ''),
(214, 'test', 'dfsghy', ''),
(215, 'test', 'dfsghy', ''),
(216, 'test', 'dfsghy', ''),
(217, 'test', 'dfsghy', ''),
(218, 'test', 'dfsghy', ''),
(219, 'test', 'dfsghy', ''),
(220, 'test', 'dfsghy', ''),
(221, 'test', 'dfsghy', ''),
(222, 'test', 'asdf', ''),
(223, 'test', 'frd', ''),
(224, 'test', 'frd', ''),
(225, 'adsf', 'asdasd', ''),
(226, 'test', 'dasdas', ''),
(227, 'adsf', 'asdsa', ''),
(228, 'test', 'test', ''),
(229, 'tes2', 'test', ''),
(230, 'test', 'sadasd', ''),
(231, 'test', 'goop', ''),
(232, 'sus', 'sus', ''),
(233, 'sus and verb', 'sus', ''),
(234, 'sus and verb', 'sus and verb', ''),
(235, 'sus', 'sus', ''),
(236, 'verb', 'berb', '');

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
(3, 19),
(4, 20),
(5, 21),
(6, 22),
(6, 23),
(6, 24),
(1, 25),
(7, 26),
(7, 27),
(7, 28),
(1, 29),
(9, 30),
(9, 31),
(9, 32),
(9, 33),
(9, 34),
(9, 35),
(9, 36),
(9, 37),
(9, 38),
(9, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 47),
(1, 48),
(1, 49),
(10, 50),
(11, 51),
(11, 52),
(11, 53),
(11, 54),
(11, 55),
(11, 56),
(11, 57),
(11, 58),
(11, 59),
(11, 60),
(12, 61),
(12, 62),
(12, 63),
(12, 64),
(12, 65),
(12, 66),
(12, 67),
(12, 68),
(12, 69),
(12, 70),
(13, 71),
(13, 72),
(13, 73),
(13, 74),
(13, 75),
(13, 76),
(13, 77),
(13, 78),
(13, 79),
(13, 80),
(14, 81),
(14, 82),
(14, 83),
(14, 84),
(14, 85),
(14, 86),
(14, 87),
(14, 88),
(14, 89),
(14, 90),
(15, 91),
(15, 92),
(15, 93),
(15, 94),
(15, 95),
(15, 96),
(15, 97),
(15, 98),
(15, 99),
(15, 100),
(16, 101),
(16, 102),
(16, 103),
(16, 104),
(16, 105),
(16, 106),
(16, 107),
(16, 108),
(16, 109),
(16, 110),
(17, 111),
(17, 112),
(17, 113),
(17, 114),
(17, 115),
(17, 116),
(17, 117),
(17, 118),
(17, 119),
(17, 120),
(19, 121),
(19, 122),
(19, 123),
(19, 124),
(19, 125),
(19, 126),
(19, 127),
(19, 128),
(19, 129),
(19, 130),
(21, 131),
(21, 132),
(21, 133),
(21, 134),
(21, 135),
(21, 136),
(22, 137),
(22, 138),
(22, 139),
(22, 140),
(22, 141),
(22, 142),
(23, 143),
(23, 144),
(23, 145),
(23, 146),
(23, 147),
(23, 148),
(24, 149),
(24, 150),
(24, 151),
(24, 152),
(24, 153),
(24, 154),
(29, 155),
(29, 156),
(29, 157),
(29, 158),
(29, 159),
(29, 160),
(30, 161),
(30, 162),
(30, 163),
(30, 164),
(30, 165),
(30, 166),
(31, 167),
(31, 168),
(31, 169),
(31, 170),
(31, 171),
(31, 172),
(32, 173),
(32, 174),
(32, 175),
(32, 176),
(32, 177),
(32, 178),
(34, 179),
(34, 180),
(34, 181),
(34, 182),
(34, 183),
(34, 184),
(35, 185),
(35, 186),
(35, 187),
(35, 188),
(35, 189),
(35, 190),
(36, 191),
(36, 192),
(36, 193),
(36, 194),
(36, 195),
(36, 196),
(41, 197),
(42, 198),
(43, 199),
(44, 200),
(45, 201),
(46, 202),
(47, 203),
(48, 204),
(49, 205),
(49, 206),
(50, 207),
(51, 208),
(52, 209),
(53, 210),
(55, 212),
(71, 228),
(71, 229),
(72, 230),
(72, 231),
(75, 234),
(75, 235),
(75, 236);

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

--
-- Dumping data for table `entryToTag`
--

INSERT INTO `entryToTag` (`tagID`, `entryID`) VALUES
(1, 165),
(2, 166),
(1, 170),
(1, 171),
(2, 172),
(1, 176),
(1, 177),
(1, 182),
(1, 183),
(1, 188),
(1, 189),
(1, 190),
(2, 190),
(1, 194),
(1, 195),
(2, 196),
(1, 207),
(1, 228),
(2, 228),
(1, 230),
(1, 234),
(2, 234),
(1, 235),
(2, 236);

-- --------------------------------------------------------

--
-- Table structure for table `Instructor`
--

CREATE TABLE `Instructor` (
  `email` varchar(80) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Instructor`
--

INSERT INTO `Instructor` (`email`, `password`, `name`) VALUES
('jbws@gmail.com', 'jbws', 'William'),
('marcos@test.edu', 'test', 'Profesor Marcos'),
('testteacher@gmail.com', 'test', 'Test Teacher'),
('vickie@stedwards.edu', 'demo', 'Profesora Yescas');

-- --------------------------------------------------------

--
-- Table structure for table `PersonalVocabList`
--

CREATE TABLE `PersonalVocabList` (
  `personalVocabID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PersonalVocabList`
--

INSERT INTO `PersonalVocabList` (`personalVocabID`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22);

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

--
-- Dumping data for table `Question`
--

INSERT INTO `Question` (`questionID`, `questionType`, `questionText`, `starredAnswer`, `classroomID`, `questionEmail`, `questionName`) VALUES
(1, 1, 'test', 0, 1, '', ''),
(2, 2, 'testq2', 0, 1, 'testqemail', 'testqname'),
(3, 1, 'test', 0, 5, 'testemail', 'testname'),
(4, 2, 'calor', 4, 5, 'testEmail', 'testName');

-- --------------------------------------------------------

--
-- Table structure for table `Student`
--

CREATE TABLE `Student` (
  `email` varchar(80) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `name` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Student`
--

INSERT INTO `Student` (`email`, `password`, `name`) VALUES
('1234@gmail.com', NULL, NULL),
('1234@test.com', NULL, NULL),
('4567@gmail.com', NULL, NULL),
('antonio@stedwards.edu', NULL, NULL),
('carlos@stedwards.edu', NULL, NULL),
('cosc@stedwards.edu', NULL, NULL),
('enrique@stedwards.edu', NULL, NULL),
('fasd@sdfa.sdfjasd', NULL, NULL),
('hola@stedwards.edu', NULL, NULL),
('hugo@gmail.com', NULL, NULL),
('isabella@stedwards.edu', NULL, NULL),
('ï»¿mramir14@stedwards.edu', NULL, NULL),
('laura@stedwards.edu', NULL, NULL),
('marcos@gmail.com', NULL, NULL),
('marcos@stedwards.edu', '123', 'Marcos Ramirez'),
('mari@stedwards.edu', NULL, NULL),
('maria@stedwards.edu', NULL, NULL),
('marina@stedwards.edu', NULL, NULL),
('meee@gmail.com', NULL, NULL),
('mramir14@stedwards.edu', 'test', 'Marcos P Ramirez'),
('pablo@stedwards.edu', NULL, NULL),
('personal@gmail.com', NULL, NULL),
('raul@stedwards.edu', NULL, NULL),
('test@gmail.com', NULL, NULL),
('testin123@yahoo.com', NULL, NULL),
('vickie@test.com', NULL, NULL),
('yftgdsuahdak', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `studentToClassroom`
--

CREATE TABLE `studentToClassroom` (
  `studentEmail` varchar(80) NOT NULL,
  `classroomID` int(11) NOT NULL,
  `personalVocabID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `studentToClassroom`
--

INSERT INTO `studentToClassroom` (`studentEmail`, `classroomID`, `personalVocabID`) VALUES
('1234@test.com', 1, 0),
('antonio@stedwards.edu', 3, 21),
('carlos@stedwards.edu', 3, 19),
('cosc@stedwards.edu', 1, 0),
('enrique@stedwards.edu', 3, 22),
('fasd@sdfa.sdfjasd', 3, 0),
('hola@stedwards.edu', 3, 0),
('hugo@gmail.com', 1, 4),
('hugo@gmail.com', 2, 8),
('isabella@stedwards.edu', 3, 17),
('ï»¿mramir14@stedwards.edu', 1, 0),
('laura@stedwards.edu', 3, 15),
('marcos@gmail.com', 1, 0),
('marcos@stedwards.edu', 5, 0),
('mari@stedwards.edu', 3, 16),
('maria@stedwards.edu', 3, 0),
('marina@stedwards.edu', 3, 18),
('mramir14@stedwards.edu', 1, 1),
('pablo@stedwards.edu', 3, 14),
('personal@gmail.com', 1, 3),
('personal@gmail.com', 2, 7),
('raul@stedwards.edu', 3, 20),
('test@gmail.com', 1, 0),
('testin123@yahoo.com', 3, 0),
('vickie@test.com', 1, 0),
('yftgdsuahdak', 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Tag`
--

CREATE TABLE `Tag` (
  `tagID` int(11) NOT NULL,
  `tagText` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Tag`
--

INSERT INTO `Tag` (`tagID`, `tagText`) VALUES
(1, 'sustantivo'),
(2, 'verbo');

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
  MODIFY `answerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Classroom`
--
ALTER TABLE `Classroom`
  MODIFY `classID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Dictionary`
--
ALTER TABLE `Dictionary`
  MODIFY `dictionaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `Entry`
--
ALTER TABLE `Entry`
  MODIFY `entryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=237;

--
-- AUTO_INCREMENT for table `PersonalVocabList`
--
ALTER TABLE `PersonalVocabList`
  MODIFY `personalVocabID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `Question`
--
ALTER TABLE `Question`
  MODIFY `questionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Tag`
--
ALTER TABLE `Tag`
  MODIFY `tagID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
