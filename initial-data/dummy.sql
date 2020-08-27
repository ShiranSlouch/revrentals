-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Aug 26, 2020 at 03:09 PM
-- Server version: 5.7.21
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `revrentals`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_devices_history_log`
--

CREATE TABLE `access_devices_history_log` (
  `id` int(11) NOT NULL,
  `access_levels` text,
  `fobs` text,
  `access_keys` text,
  `remote_controllers` text,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `reasons` text,
  `update_comments` text,
  `building_id` int(11) NOT NULL,
  `apartment_id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `attachment` text,
  `total_price` float NOT NULL,
  `reimbursement_date` datetime DEFAULT NULL,
  `check_number` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `access_devices_history_log`
--

INSERT INTO `access_devices_history_log` (`id`, `access_levels`, `fobs`, `access_keys`, `remote_controllers`, `start_date`, `end_date`, `reasons`, `update_comments`, `building_id`, `apartment_id`, `tenant_id`, `attachment`, `total_price`, `reimbursement_date`, `check_number`, `created_at`, `updated_at`) VALUES
(1, 'Front Door\r\nGarage', '23', '', '1', '2020-08-20 00:00:00', '2020-08-27 00:00:00', 'broken', '234234sdf', 1, 1, 1, 'Aharon-1597937904707.jpg', 100, '2020-08-25 00:00:00', '123123', '2020-08-20 09:37:43', '2020-08-20 11:38:25'),
(2, 'Front Door\r\nGarage\r\nBack Door', '23', '12', '3', '2020-08-20 00:00:00', NULL, NULL, NULL, 3, 5, 3, 'Aharon-1597936518977.jpg', 100, NULL, '123', '2020-08-20 11:15:33', '2020-08-20 11:15:33'),
(3, 'Front Door\r\nGarage', '23', '12', '3', '2020-08-20 00:00:00', '2020-08-26 00:00:00', 'stollen', 'dsf', 1, 1, 1, '[object Object];;;Tamara-1597937460318.jpg', 100, '2020-08-25 00:00:00', '123', '2020-08-20 11:31:00', '2020-08-20 11:48:11'),
(4, 'Front Door\r\nGarage', '23', '12', '3', '2020-08-20 00:00:00', NULL, NULL, NULL, 1, 1, 1, 'Tamara-1597937541237.jpg', 100, NULL, '123', '2020-08-20 11:32:21', '2020-08-20 11:32:21'),
(5, 'Front Door\r\nGarage', '42', '', '12', '2020-08-20 00:00:00', '2020-08-20 00:00:00', 'stollen', '234', 1, 1, 1, 'Tamara-1597938816872.jpg', 100, '2020-08-27 00:00:00', '456123', '2020-08-20 11:53:37', '2020-08-20 11:54:28'),
(6, 'Front Door\r\nGarage', '34455\r\n', '34567\r\n344555', '234556\r\n23455', '2020-08-21 00:00:00', NULL, NULL, NULL, 1, 1, 1, '', 150, NULL, '34555', '2020-08-21 08:56:49', '2020-08-21 08:56:49'),
(7, 'Front Door\r\nGarage', '34556\r\n5678\r\n67899\r\n', '34', '', '2020-08-21 00:00:00', NULL, NULL, NULL, 1, 1, 1, '', 200, NULL, '', '2020-08-21 21:36:14', '2020-08-21 21:36:14');

-- --------------------------------------------------------

--
-- Table structure for table `apartments`
--

CREATE TABLE `apartments` (
  `id` int(11) NOT NULL,
  `number` varchar(255) NOT NULL,
  `building_id` int(11) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `apartments`
--

INSERT INTO `apartments` (`id`, `number`, `building_id`, `created_at`, `updated_at`) VALUES
(1, '3', 1, '2020-08-18', '2020-08-18'),
(2, '5', 1, '2020-08-18', '2020-08-18'),
(3, '1A', 2, '2020-08-18', '2020-08-18'),
(5, '2', 3, '2020-08-18', '2020-08-18'),
(8, '12', 4, '2020-08-24', '2020-08-24'),
(9, '40', 4, '2020-08-24', '2020-08-24'),
(10, '1', 5, '2020-08-26', '2020-08-26'),
(13, '4', 5, '2020-08-26', '2020-08-26'),
(16, '6', 5, '2020-08-26', '2020-08-26'),
(19, '7', 5, '2020-08-26', '2020-08-26'),
(20, '8', 5, '2020-08-26', '2020-08-26'),
(21, '9', 5, '2020-08-26', '2020-08-26'),
(22, '10', 5, '2020-08-26', '2020-08-26'),
(23, '11', 5, '2020-08-26', '2020-08-26'),
(25, '13', 5, '2020-08-26', '2020-08-26'),
(26, '14', 5, '2020-08-26', '2020-08-26'),
(27, '15', 5, '2020-08-26', '2020-08-26'),
(28, '3421', 7, '2020-08-26', '2020-08-26'),
(29, '3423', 7, '2020-08-26', '2020-08-26'),
(30, '3425', 7, '2020-08-26', '2020-08-26'),
(31, '3427', 7, '2020-08-26', '2020-08-26'),
(32, '3429', 7, '2020-08-26', '2020-08-26'),
(33, '3431', 7, '2020-08-26', '2020-08-26'),
(34, '3433', 7, '2020-08-26', '2020-08-26'),
(35, '3435', 7, '2020-08-26', '2020-08-26'),
(36, '3437', 7, '2020-08-26', '2020-08-26'),
(37, '3439', 7, '2020-08-26', '2020-08-26'),
(38, '3441', 7, '2020-08-26', '2020-08-26'),
(39, '3443', 7, '2020-08-26', '2020-08-26'),
(40, '3439A', 7, '2020-08-26', '2020-08-26'),
(41, '3423A', 7, '2020-08-26', '2020-08-26'),
(42, '3425A', 7, '2020-08-26', '2020-08-26'),
(43, '3431A', 7, '2020-08-26', '2020-08-26'),
(44, '3433A', 7, '2020-08-26', '2020-08-26'),
(45, '3441A', 7, '2020-08-26', '2020-08-26');

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `id` int(11) NOT NULL,
  `address` text NOT NULL,
  `access_levels` text NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `buildings`
--

INSERT INTO `buildings` (`id`, `address`, `access_levels`, `created_at`, `updated_at`) VALUES
(1, '424 Street, San Francisco, California, USA', 'Front Door\r\nGarage', '2020-08-18', '2020-08-20'),
(2, '444 Street, San Francisco, California, USA', 'Front Door', '2020-08-18', '2020-08-20'),
(3, '433 Street, San Francisco, California, USA', 'Front Door\r\nGarage\r\nBack Door', '2020-08-18', '2020-08-20'),
(4, '6794 Louis-Pasteur, Cote saint Luc, Quebec', 'Back Door\r\nFront door', '2020-08-24', '2020-08-24'),
(5, '5550 Isabella, Cote Saint Luc, Quebec', '', '2020-08-26', '2020-08-26'),
(6, '4875 Edouard Montpetit, montreal, Quebec', '', '2020-08-26', '2020-08-26'),
(7, 'Hotel De Ville, Montreal, Quebec', '', '2020-08-26', '2020-08-26');

-- --------------------------------------------------------

--
-- Table structure for table `history_log_files`
--

CREATE TABLE `history_log_files` (
  `id` int(11) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `encoding` varchar(255) NOT NULL,
  `file_path` varchar(300) NOT NULL,
  `mimetype` varchar(255) NOT NULL,
  `size` float NOT NULL,
  `access_devices_history_log_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `sess` json NOT NULL,
  `expired` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`sid`, `sess`, `expired`) VALUES
('nzeJ4nNr7W7sV2qoVfhxidF-ozx7sght', '{\"cookie\": {\"path\": \"/\", \"expires\": null, \"httpOnly\": true, \"originalMaxAge\": null}, \"passport\": {\"user\": 19}}', '2020-08-27 14:04:34');

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`id`, `full_name`, `email`, `phone_number`, `created_at`, `updated_at`) VALUES
(1, 'David', 'david@test.com', '1234', '2020-08-19 10:25:49', '2020-08-19 10:27:07'),
(2, 'Alice', 'alice@foo.com', '123', '2020-08-19 10:47:43', '2020-08-19 10:47:43'),
(3, 'Bob', 'bob@foo.com', '123', '2020-08-19 11:04:36', '2020-08-19 11:04:36'),
(4, 'John ', 'John@foo.com', '34567', '2020-08-21 08:52:45', '2020-08-21 08:52:45');

-- --------------------------------------------------------

--
-- Table structure for table `upload`
--

CREATE TABLE `upload` (
  `id` int(11) NOT NULL,
  `week` date NOT NULL,
  `pab_schedule` varchar(255) NOT NULL,
  `support_schedule` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `id` int(11) NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Address` varchar(255) DEFAULT 'N/A',
  `Apt` varchar(20) DEFAULT NULL,
  `Size` float DEFAULT NULL,
  `Description` varchar(255) NOT NULL DEFAULT 'Write a description',
  `Price` varchar(255) DEFAULT NULL,
  `date_of_availability` datetime DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`id`, `hidden`, `created_at`, `updated_at`, `Address`, `Apt`, `Size`, `Description`, `Price`, `date_of_availability`, `contact`, `picture`) VALUES
(8, 0, '2018-11-29 16:10:49', '2019-08-05 18:22:24', '3635 Ridgewood', '506', 4.5, 'Fully renovated 2 bedroom,  heating and hot water included fridge and stove, no washer dryer  in apt , parking available at extra cost', '1500', '2019-09-01 00:00:00', '', '3605-ridge-1565043251714.jpg'),
(18, 0, '2019-08-05 18:07:30', '2019-08-05 14:07:30', '4850 Cote St Luc road', '89', 5.5, 'Renovated 5.5, beautiful sunny apartment on the 8th floor, balcony, Electricity not included, 1 indoor parking included and 1 storage included. ', '2900', '2019-09-01 00:00:00', '', 'media-1565028450358.jpg'),
(19, 0, '2019-08-05 22:12:00', '2019-08-05 18:12:00', '3635 Ridgewood', '306', 4.5, 'To be renovated floor heating and hot water included fridge and stove, parking available at extra cost', '1500', '2019-09-01 00:00:00', '', '3605-ridge-1565043119357.jpg'),
(20, 0, '2019-08-05 22:13:23', '2019-08-05 18:13:23', '3635 Ridgewood', '302', 4.5, 'Renove, floor heating and hot water included fridge and stove, no washer dryer  in apt , parking available at extra cost', '1500', '2019-07-01 00:00:00', '', '3605-ridge-1565043203801.jpg'),
(21, 0, '2019-08-05 22:26:22', '2019-08-05 18:26:22', '4875 Edouard montpetit', '6', 4.5, 'Semi Renovated 2 bedroom apt on the first floor, fridge stove, heating and hot water included, interior parking available at extra 125$/month', '1400', '2019-08-01 00:00:00', '', 'IMG_56111-1-1565043982612.jpg'),
(23, 1, '2019-08-26 16:07:12', '2020-08-14 11:11:32', 'HIDDEN_HOME', '-1', -1, 'Hidden home. Used for displaying the last updated time.', '-1', '2019-08-26 12:07:12', '', ''),
(26, 0, '2019-08-27 14:48:51', '2019-08-27 10:48:51', 'N/A', NULL, NULL, 'Write a description', NULL, NULL, NULL, 'prestigious-office-1566917331296.jpg'),
(28, 0, '2019-08-27 15:12:59', '2019-08-27 11:30:05', 'address 4242', '123', NULL, 'testing the multiple images', '4242', NULL, NULL, 'new-york-1566918779852.jpg;;;rsz_myst_old-1566919802132.jpg;;;brown-1566919802137.jpg'),
(29, 0, '2019-08-27 15:30:44', '2019-08-27 11:51:46', 'N/A', NULL, NULL, 'Write a description', NULL, NULL, 'tetetetest', ''),
(31, 0, '2019-10-14 14:39:08', '2019-10-14 10:39:23', 'test', '2A', NULL, 'Write a description', NULL, NULL, NULL, ''),
(32, 0, '2020-06-16 00:47:26', '2020-06-15 20:47:26', 'N/A', NULL, NULL, 'Write a description', '45.6s', NULL, NULL, NULL),
(33, 0, '2020-08-14 15:24:20', '2020-08-14 11:24:20', 'asdasdasd', '123', 123, 'asdasdasd', '123', '2020-08-28 00:00:00', 'asdasdasd', 'Tamara-1597418660420.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `uploads2`
--

CREATE TABLE `uploads2` (
  `id` int(11) NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Address` varchar(255) DEFAULT 'N/A',
  `Apt` varchar(20) DEFAULT NULL,
  `Size` float DEFAULT NULL,
  `Description` varchar(255) NOT NULL DEFAULT 'Write a description',
  `Price` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `date_of_availability` datetime DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `uploads2`
--

INSERT INTO `uploads2` (`id`, `hidden`, `created_at`, `updated_at`, `Address`, `Apt`, `Size`, `Description`, `Price`, `contact`, `date_of_availability`, `picture`) VALUES
(14, 0, '2019-06-20 01:14:35', '2019-08-27 11:42:22', '4 cavendish', '3', 34.5, 'very  good', '2000', 'agent k', '2019-08-06 00:00:00', 'prestigious-office-1566920542099.jpg;;;Featured-1566920542261.jpg'),
(16, 0, '2019-07-02 15:38:38', '2019-08-07 15:06:41', '3635 Ridgewood', '22', 3.5, 'nklscx bndkanl ndlxkanxl` ', '1000', '', '2019-08-06 00:00:00', 'JoelSlouch-1562081918061.jpg'),
(17, 0, '2019-08-08 15:48:52', '2019-08-08 11:48:52', '896 mclear', '6', 2.5, 'very good', '100', '', '2019-08-07 00:00:00', 'prestigious-office-1565279332714.jpg'),
(18, 1, '2019-08-26 16:07:12', '2019-08-26 21:47:16', 'HIDDEN_HOME', '-1', -1, 'Hidden home. Used for displaying the last updated time.', '-1', '', '2019-08-26 12:07:12', ''),
(19, 0, '2019-08-27 01:45:37', '2019-08-26 21:45:37', '45', '88', 80, 'jkkll', NULL, NULL, NULL, NULL),
(20, 0, '2020-08-20 15:01:17', '2020-08-20 11:01:17', 'asd123', '12', 123, 'adasdasd', '12', '123', '2020-08-21 00:00:00', 'Aharon-1597935677523.jpg'),
(21, 0, '2020-08-24 13:13:56', '2020-08-24 09:13:56', '3635 Ridgewood', '42', 4.5, 'test123', '1559', 'agent', '2020-08-25 00:00:00', NULL),
(22, 0, '2020-08-24 13:14:39', '2020-08-24 09:14:39', '4 cavendish', '2e', 3.5, 'test 1234', '4242', 'tenant', '2020-08-28 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `reset_password_token` varchar(256) DEFAULT NULL,
  `type` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `reset_password_token`, `type`) VALUES
(4, 'gal', 'gal', 'gal@test.com', '$2a$10$zJ4.ZFeM.OcpMM1iVSZknOjVZMZUdsylMGHM8xCgcwGG4FY5j2l7i', NULL, 0),
(15, 'moli', 'koli', 'moli@test.com', '$2a$10$8heUB54BR314m1AfVjVzHe3tZw./FTHK2ZkldLEhMJveqoRYunRAG', NULL, 0),
(16, 'roki', 'roki', 'roki@test.com', '$2a$10$7UMHlRkUHWbscYRgpVBYUu9665/qXd4/TjY9DDBwq0697wsQH4.Pq', NULL, 1),
(17, 'tal', 'tal', 'tal@test.com', '$2a$10$TrF6kjNi6NeuSJxsh6KV6uGaCeA14C4qdw8LvkIBu9KEUm4f65Kaq', NULL, 1),
(18, 'nina', 'nina', 'nina@test.com', '$2a$10$midQibpXD6RXnplsPjXQ8Oz039pQwaJIqrl82Madov6WGfVKLcOH.', NULL, 2),
(19, 'Revital', 'Bouganim', 'rev_bou@hotmail.com', '$2a$10$hn.mlYM25ECI6qA7PMcpY.igfGABtKku3MfLFCg90Ki7VLA2resEq', NULL, 2),
(21, 'maya', 'c', 'maya@test.com', '$2a$10$hn.mlYM25ECI6qA7PMcpY.igfGABtKku3MfLFCg90Ki7VLA2resEq', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_devices_history_log`
--
ALTER TABLE `access_devices_history_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `apartment_id_index` (`apartment_id`),
  ADD KEY `building_id_history_log` (`building_id`),
  ADD KEY `tenant_id_index` (`tenant_id`);

--
-- Indexes for table `apartments`
--
ALTER TABLE `apartments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `building_id_index` (`building_id`);

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history_log_files`
--
ALTER TABLE `history_log_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `sessions_expired_index` (`expired`);

--
-- Indexes for table `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unique_index` (`email`),
  ADD KEY `tenant_updated_at` (`updated_at`),
  ADD KEY `tenant_phone_number` (`phone_number`);

--
-- Indexes for table `upload`
--
ALTER TABLE `upload`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Hidden` (`hidden`);

--
-- Indexes for table `uploads2`
--
ALTER TABLE `uploads2`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Hidden` (`hidden`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Unique reset password token` (`reset_password_token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_devices_history_log`
--
ALTER TABLE `access_devices_history_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `apartments`
--
ALTER TABLE `apartments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `history_log_files`
--
ALTER TABLE `history_log_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tenants`
--
ALTER TABLE `tenants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `upload`
--
ALTER TABLE `upload`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `uploads2`
--
ALTER TABLE `uploads2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
