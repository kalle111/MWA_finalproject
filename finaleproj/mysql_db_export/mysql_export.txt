-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 30. Jun 2019 um 22:12
-- Server-Version: 10.1.40-MariaDB
-- PHP-Version: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `finalproject`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `consumers`
--

CREATE TABLE `consumers` (
  `customer_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `city` varchar(55) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `accountname` varchar(20) NOT NULL,
  `accountpassword` varchar(10) NOT NULL,
  `accounttype` enum('customer','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `city` varchar(55) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `accountname` varchar(20) NOT NULL,
  `accountpassword` varchar(10) NOT NULL,
  `accounttype` enum('customer','admin','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Daten für Tabelle `customers`
--

INSERT INTO `customers` (`customer_id`, `firstname`, `lastname`, `address`, `postal_code`, `city`, `phone_number`, `accountname`, `accountpassword`, `accounttype`) VALUES
(1, 'Marc', 'Orel', 'Am Sand 9a', '93055', 'Regensburg', '0152123123', 'marc93', '123456', 'customer'),
(2, '22Marc', '22Orel', 'Am Sand 4', '92318', 'Neumarkt i. d. Opf.', '01621801413', 'marc94', '123456', 'admin'),
(3, 'test', 'test', 'test', '92111', 'test', '01621801413', 'webAppTest', 'test', 'customer');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `offers`
--

CREATE TABLE `offers` (
  `offer_id` int(11) NOT NULL,
  `offer_title` varchar(55) NOT NULL,
  `offer_desc` varchar(255) NOT NULL,
  `offer_consumerId` int(11) NOT NULL,
  `offer_cost` decimal(50,2) DEFAULT NULL,
  `offer_status` enum('REQUESTED','ANSWERED','ACCEPTED','REJECTED') NOT NULL,
  `offer_extra_information` varchar(999) DEFAULT NULL,
  `datetime_requested` datetime DEFAULT NULL,
  `datetime_aswered` datetime DEFAULT NULL,
  `datetime_accepted_rejected` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Daten für Tabelle `offers`
--

INSERT INTO `offers` (`offer_id`, `offer_title`, `offer_desc`, `offer_consumerId`, `offer_cost`, `offer_status`, `offer_extra_information`, `datetime_requested`, `datetime_aswered`, `datetime_accepted_rejected`) VALUES
(1, 'Plant watering1', 'Watering of private plants of House C', 1, '199.99', 'ANSWERED', 'Watering of private plants of Hous b22', '2019-06-25 09:57:14', '2019-06-30 18:38:42', NULL),
(5, '1337', '1337', 1, '9999.99', 'ANSWERED', '1337', '2019-06-25 16:31:06', '2019-06-25 22:00:00', '2019-06-26 16:49:17'),
(6, 'abc', 'abc', 1, NULL, 'REQUESTED', NULL, '2019-06-25 16:39:34', NULL, NULL),
(24, '1', '1', 1, NULL, 'REQUESTED', 'sdfgsdfg', '2019-06-26 18:55:04', NULL, NULL),
(25, 'last offer test', 'last offer test', 1, '125.55', 'REJECTED', '012', '2019-06-28 09:05:14', '2019-06-28 00:00:00', '2019-06-28 09:05:53'),
(28, '1', '1', 2, NULL, 'REQUESTED', 'abc', '2019-06-30 17:56:06', NULL, NULL),
(29, '2', '2', 1, '111.00', 'REQUESTED', '1', '2019-06-30 19:38:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `offer_status`
--

CREATE TABLE `offer_status` (
  `statusid` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Daten für Tabelle `offer_status`
--

INSERT INTO `offer_status` (`statusid`, `description`) VALUES
(1, 'REQUESTED'),
(2, 'ANSWERED'),
(3, 'ACCEPTED'),
(4, 'REJECTED');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `order_ordered_date` datetime DEFAULT NULL,
  `order_started_date` datetime DEFAULT NULL,
  `order_ready_date` datetime DEFAULT NULL,
  `order_accrej_date` datetime DEFAULT NULL,
  `workitemId` int(11) DEFAULT NULL,
  `customerId` int(11) NOT NULL,
  `order_price` decimal(50,2) NOT NULL,
  `status` enum('ORDERED','STARTED','READY','ACCEPTED','REJECTED') NOT NULL,
  `extra_information` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Daten für Tabelle `orders`
--

INSERT INTO `orders` (`order_id`, `title`, `description`, `order_ordered_date`, `order_started_date`, `order_ready_date`, `order_accrej_date`, `workitemId`, `customerId`, `order_price`, `status`, `extra_information`) VALUES
(1, 'testOrderOrdered\r\n', 'TestOrder1 to test ordered-status', '2019-06-18 00:00:00', '2019-06-30 19:27:10', NULL, NULL, 4, 1, '150.00', 'ORDERED', 'some1 extra 21information can be added here.'),
(2, 'testOrderStarted', 'TestOrder to test Status >>STARTED<<', '2019-06-22 00:00:00', '2019-06-23 00:00:00', NULL, NULL, 4, 1, '0.00', 'STARTED', NULL),
(3, 'testOrderREADY', 'TestOrder to test Status >>READY<<', '2019-06-22 00:00:00', '2019-06-23 00:00:00', '2019-06-23 12:00:00', NULL, 4, 1, '0.00', 'READY', NULL),
(4, 'testOrderStarted', 'testOrder to test the status >>ACCEPTED/REJECTED<<', '2019-06-22 10:00:00', '2019-06-22 11:00:00', '2019-06-22 12:00:00', '2019-06-23 13:00:00', 4, 1, '0.00', 'ACCEPTED', NULL),
(8, 'Garbage collection', 'Company to collect all gargabe bins1', '2019-06-25 09:13:25', NULL, NULL, NULL, 3, 1, '150.00', 'ORDERED', '2'),
(9, 'Lawn mowing', 'Worker to come to your house and mow the entire lawn in the frontyard', '2019-06-25 09:27:43', '2019-06-30 22:00:07', '2019-06-30 22:00:50', NULL, 1, 2, '155.00', 'READY', '199');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `order_status`
--

CREATE TABLE `order_status` (
  `statusid` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Daten für Tabelle `order_status`
--

INSERT INTO `order_status` (`statusid`, `description`) VALUES
(1, 'ORDERED'),
(2, 'STARTED'),
(3, 'READY'),
(4, 'ACCEPTED'),
(5, 'REJECTED');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `workitems`
--

CREATE TABLE `workitems` (
  `workitem_id` int(11) NOT NULL,
  `title` varchar(127) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(16,2) DEFAULT NULL,
  `prior_offer_required` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Daten für Tabelle `workitems`
--

INSERT INTO `workitems` (`workitem_id`, `title`, `description`, `price`, `prior_offer_required`) VALUES
(1, 'Lawn mowing', 'Worker to come to your house and mow the entire lawn in the frontyard', '99.99', NULL),
(2, 'Window cleaning', 'Worker to clean all windows on the property', '139.99', NULL),
(3, 'Garbage collection', 'Company to collect all gargabe bins', '50.00', NULL),
(4, 'User defined work', 'Other work, custom user requests that need to behandleded', NULL, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `workitems_temp`
--

CREATE TABLE `workitems_temp` (
  `workitemId` int(11) NOT NULL,
  `workitemname` varchar(99) NOT NULL,
  `workitemdescription` varchar(99) DEFAULT NULL,
  `workitemprice` float DEFAULT NULL,
  `dummy` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `consumers`
--
ALTER TABLE `consumers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indizes für die Tabelle `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indizes für die Tabelle `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`offer_id`),
  ADD KEY `offer_customerId` (`offer_consumerId`);

--
-- Indizes für die Tabelle `offer_status`
--
ALTER TABLE `offer_status`
  ADD PRIMARY KEY (`statusid`);

--
-- Indizes für die Tabelle `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `workitemId` (`workitemId`,`customerId`),
  ADD KEY `orders_customerId` (`customerId`);

--
-- Indizes für die Tabelle `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`statusid`);

--
-- Indizes für die Tabelle `workitems`
--
ALTER TABLE `workitems`
  ADD PRIMARY KEY (`workitem_id`);

--
-- Indizes für die Tabelle `workitems_temp`
--
ALTER TABLE `workitems_temp`
  ADD PRIMARY KEY (`workitemId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `consumers`
--
ALTER TABLE `consumers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `offers`
--
ALTER TABLE `offers`
  MODIFY `offer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT für Tabelle `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT für Tabelle `workitems`
--
ALTER TABLE `workitems`
  MODIFY `workitem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `workitems_temp`
--
ALTER TABLE `workitems_temp`
  MODIFY `workitemId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_customerId` FOREIGN KEY (`customerId`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `orders_workitemid` FOREIGN KEY (`workitemId`) REFERENCES `workitems` (`workitem_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
