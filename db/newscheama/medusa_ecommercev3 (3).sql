-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2025 at 05:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medusa_ecommercev3`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us_setting`
--

CREATE TABLE `about_us_setting` (
  `idAbout_Us_Setting` int(11) NOT NULL,
  `Statistics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Statistics`)),
  `Vision_Image_Url` text DEFAULT NULL,
  `Vision_Title` varchar(255) DEFAULT NULL,
  `Vision_Description` text DEFAULT NULL,
  `Mission_Image_Url` text DEFAULT NULL,
  `Mission_Title` varchar(255) DEFAULT NULL,
  `Mission_Description` text DEFAULT NULL,
  `Values_Image_Url` text DEFAULT NULL,
  `Values_Title` varchar(255) DEFAULT NULL,
  `Values_Description` text DEFAULT NULL,
  `Features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Features`)),
  `Why_Choose_Us_Image_Url` text DEFAULT NULL,
  `Shopping_Experience_Title` varchar(255) DEFAULT NULL,
  `Shopping_Experience_Description` text DEFAULT NULL,
  `Shopping_Experience_Button_Text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_logs`
--

CREATE TABLE `admin_logs` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `new_user_info` mediumtext DEFAULT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_notification_status`
--

CREATE TABLE `admin_notification_status` (
  `notification_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `idCart` int(11) NOT NULL,
  `Customer_idCustomer` int(11) DEFAULT NULL,
  `Total_Items` int(11) DEFAULT NULL,
  `Total_Amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_has_product`
--

CREATE TABLE `cart_has_product` (
  `Cart_idCart` int(11) NOT NULL,
  `Product_Variations_idProduct_Variations` int(11) NOT NULL,
  `Rate` decimal(10,2) DEFAULT NULL,
  `Market_Rate` float(10,2) DEFAULT NULL,
  `Qty` int(11) DEFAULT NULL,
  `Total_Amount` decimal(10,2) DEFAULT NULL,
  `Discount_Percentage` decimal(5,2) DEFAULT NULL,
  `Discount_Amount` decimal(10,2) DEFAULT NULL,
  `NetAmount` decimal(10,2) DEFAULT NULL,
  `Note` text DEFAULT NULL,
  `Discounts_idDiscounts` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Event_Discounts_idEvent_Discounts` int(11) DEFAULT NULL,
  `Discount_Type` varchar(10) DEFAULT NULL COMMENT 'regular or event',
  `Discount_Description` varchar(255) DEFAULT NULL,
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `idCities` int(11) NOT NULL,
  `Country` varchar(45) DEFAULT NULL,
  `City` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `idCustomer` int(11) NOT NULL,
  `First_Name` varchar(45) DEFAULT NULL,
  `Full_Name` varchar(45) DEFAULT NULL,
  `Birthday` date DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `City` varchar(45) DEFAULT NULL,
  `Country` varchar(45) DEFAULT NULL,
  `Mobile_No` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_password_otp` varchar(10) DEFAULT NULL,
  `reset_password_otp_expires` timestamp NULL DEFAULT NULL,
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_address`
--

CREATE TABLE `delivery_address` (
  `idDelivery_Address` int(11) NOT NULL,
  `Customer_idCustomer` int(11) DEFAULT NULL,
  `Full_Name` varchar(45) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `City` varchar(45) DEFAULT NULL,
  `Country` varchar(45) DEFAULT NULL,
  `Mobile_No` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discounts`
--

CREATE TABLE `discounts` (
  `idDiscounts` int(11) NOT NULL,
  `Product_idProduct` int(11) DEFAULT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `Discount_Type` varchar(45) DEFAULT NULL,
  `Discount_Value` decimal(10,2) DEFAULT NULL,
  `Start_Date` varchar(45) DEFAULT NULL,
  `End_Date` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `idEvent` int(11) NOT NULL,
  `Event_Name` varchar(100) DEFAULT NULL,
  `Event_Description` text DEFAULT NULL,
  `Event_Image_Url` text DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_discounts`
--

CREATE TABLE `event_discounts` (
  `idEvent_Discounts` int(11) NOT NULL,
  `Event_idEvent` int(11) NOT NULL,
  `Product_Ids` text NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Discount_Type` varchar(45) NOT NULL,
  `Discount_Value` decimal(10,2) NOT NULL,
  `Start_Date` date NOT NULL,
  `End_Date` date NOT NULL,
  `Status` varchar(45) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_has_product`
--

CREATE TABLE `event_has_product` (
  `Event_idEvent` int(11) NOT NULL,
  `Product_idProduct` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faq`
--

CREATE TABLE `faq` (
  `idFAQ` int(11) NOT NULL,
  `Question` text DEFAULT NULL,
  `Answer` text DEFAULT NULL,
  `Product_idProduct` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `header_footer_setting`
--

CREATE TABLE `header_footer_setting` (
  `idHeader_Footer_Setting` int(11) NOT NULL,
  `Navbar_Logo_Url` text DEFAULT NULL,
  `Nav_Icons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Nav_Icons`)),
  `Country_Blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Country_Blocks`)),
  `Footer_Links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Footer_Links`)),
  `Social_Icons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Social_Icons`)),
  `Footer_Copyright` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `idOrder` int(11) NOT NULL,
  `Date_Time` varchar(45) DEFAULT NULL,
  `Delivery_Address_idDelivery_Address` int(11) DEFAULT NULL,
  `Total_Amount` decimal(10,2) DEFAULT NULL,
  `Delivery_Type` varchar(45) DEFAULT NULL,
  `Delivery_Charges` decimal(10,2) DEFAULT NULL,
  `Net_Amount` decimal(10,2) DEFAULT NULL,
  `Payment_Type` varchar(45) DEFAULT NULL,
  `Payment_Stats` varchar(45) DEFAULT NULL,
  `Delivery_Status` varchar(45) DEFAULT NULL,
  `Delivery_Date` date DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `Customer_Note` text DEFAULT NULL,
  `Supplier_Note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_has_product_variations`
--

CREATE TABLE `order_has_product_variations` (
  `Order_idOrder` int(11) NOT NULL,
  `Product_Variations_idProduct_Variations` int(11) NOT NULL,
  `Rate` decimal(10,2) DEFAULT NULL,
  `Qty` int(11) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Discount_Percentage` decimal(5,2) DEFAULT NULL,
  `Discount_Amount` decimal(10,2) DEFAULT NULL,
  `Total_Amount` decimal(10,2) DEFAULT NULL,
  `Note` text DEFAULT NULL,
  `Discounts_idDiscounts` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Event_Discounts_idEvent_Discounts` int(11) DEFAULT NULL,
  `Discount_Type` varchar(10) DEFAULT NULL COMMENT 'regular or event',
  `Discount_Description` varchar(255) DEFAULT NULL,
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status_from` varchar(45) DEFAULT NULL,
  `status_to` varchar(45) DEFAULT NULL,
  `status_type` varchar(45) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `idProduct` int(11) NOT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `Product_Brand_idProduct_Brand` int(11) DEFAULT NULL,
  `Market_Price` decimal(10,2) DEFAULT NULL,
  `Selling_Price` decimal(10,2) DEFAULT NULL,
  `Main_Image_Url` text DEFAULT NULL,
  `Long_Description` text DEFAULT NULL,
  `SIH` varchar(45) DEFAULT NULL,
  `Sold_Qty` int(11) DEFAULT 0,
  `Latest_Rating` decimal(3,1) DEFAULT 0.0,
  `History_Status` varchar(45) DEFAULT 'new arrivals',
  `Status` varchar(45) DEFAULT 'active',
  `Seasonal_Offer` tinyint(4) DEFAULT 0,
  `Rush_Delivery` tinyint(4) DEFAULT 0,
  `For_You` tinyint(4) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_brand`
--

CREATE TABLE `product_brand` (
  `idProduct_Brand` int(11) NOT NULL,
  `Brand_Name` varchar(45) DEFAULT NULL,
  `Brand_Image_Url` text DEFAULT NULL,
  `ShortDescription` text DEFAULT NULL,
  `User_idUser` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `idProduct_Category` int(11) NOT NULL,
  `Image_Icon_Url` varchar(255) DEFAULT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_has_sub_category`
--

CREATE TABLE `product_has_sub_category` (
  `Product_idProduct` int(11) NOT NULL,
  `Sub_Category_idSub_Category` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `idProduct_Images` int(11) NOT NULL,
  `Product_idProduct` int(11) DEFAULT NULL,
  `Image_Url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_variations`
--

CREATE TABLE `product_variations` (
  `idProduct_Variations` int(11) NOT NULL,
  `Product_idProduct` int(11) DEFAULT NULL,
  `Colour` varchar(45) DEFAULT NULL,
  `Size` varchar(45) DEFAULT NULL,
  `Qty` int(11) DEFAULT NULL,
  `Rate` decimal(10,2) DEFAULT 0.00,
  `SIH` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `idReview` int(11) NOT NULL,
  `Customer_idCustomer` int(11) DEFAULT NULL,
  `Product_idProduct` int(11) DEFAULT NULL,
  `Rating_5` decimal(2,1) DEFAULT NULL,
  `Comment` varchar(45) DEFAULT NULL,
  `Date_Time` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_category`
--

CREATE TABLE `sub_category` (
  `idSub_Category` int(11) NOT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `Product_Category_idProduct_Category` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `idUser` int(11) NOT NULL,
  `Full_Name` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Phone_No` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `Otp` varchar(6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orgmail` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us_setting`
--
ALTER TABLE `about_us_setting`
  ADD PRIMARY KEY (`idAbout_Us_Setting`);

--
-- Indexes for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `admin_notification_status`
--
ALTER TABLE `admin_notification_status`
  ADD PRIMARY KEY (`notification_id`,`admin_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`idCart`),
  ADD KEY `Customer_idCustomer` (`Customer_idCustomer`);

--
-- Indexes for table `cart_has_product`
--
ALTER TABLE `cart_has_product`
  ADD PRIMARY KEY (`Cart_idCart`,`Product_Variations_idProduct_Variations`),
  ADD KEY `Product_Variations_idProduct_Variations` (`Product_Variations_idProduct_Variations`),
  ADD KEY `idx_cart_event_discount` (`Event_Discounts_idEvent_Discounts`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`idCities`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`idCustomer`);

--
-- Indexes for table `delivery_address`
--
ALTER TABLE `delivery_address`
  ADD PRIMARY KEY (`idDelivery_Address`),
  ADD KEY `Customer_idCustomer` (`Customer_idCustomer`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`idDiscounts`),
  ADD KEY `Product_idProduct` (`Product_idProduct`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`idEvent`);

--
-- Indexes for table `event_discounts`
--
ALTER TABLE `event_discounts`
  ADD PRIMARY KEY (`idEvent_Discounts`),
  ADD KEY `Event_idEvent` (`Event_idEvent`);

--
-- Indexes for table `event_has_product`
--
ALTER TABLE `event_has_product`
  ADD PRIMARY KEY (`Event_idEvent`,`Product_idProduct`),
  ADD KEY `Product_idProduct` (`Product_idProduct`);

--
-- Indexes for table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`idFAQ`),
  ADD KEY `Product_idProduct` (`Product_idProduct`);

--
-- Indexes for table `header_footer_setting`
--
ALTER TABLE `header_footer_setting`
  ADD PRIMARY KEY (`idHeader_Footer_Setting`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`idOrder`),
  ADD KEY `Delivery_Address_idDelivery_Address` (`Delivery_Address_idDelivery_Address`);

--
-- Indexes for table `order_has_product_variations`
--
ALTER TABLE `order_has_product_variations`
  ADD PRIMARY KEY (`Order_idOrder`,`Product_Variations_idProduct_Variations`),
  ADD KEY `Product_Variations_idProduct_Variations` (`Product_Variations_idProduct_Variations`),
  ADD KEY `Discounts_idDiscounts` (`Discounts_idDiscounts`),
  ADD KEY `idx_order_event_discount` (`Event_Discounts_idEvent_Discounts`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`idProduct`),
  ADD KEY `Product_Brand_idProduct_Brand` (`Product_Brand_idProduct_Brand`);

--
-- Indexes for table `product_brand`
--
ALTER TABLE `product_brand`
  ADD PRIMARY KEY (`idProduct_Brand`),
  ADD KEY `User_idUser` (`User_idUser`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`idProduct_Category`);

--
-- Indexes for table `product_has_sub_category`
--
ALTER TABLE `product_has_sub_category`
  ADD PRIMARY KEY (`Product_idProduct`,`Sub_Category_idSub_Category`),
  ADD KEY `Sub_Category_idSub_Category` (`Sub_Category_idSub_Category`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`idProduct_Images`),
  ADD KEY `Product_idProduct` (`Product_idProduct`);

--
-- Indexes for table `product_variations`
--
ALTER TABLE `product_variations`
  ADD PRIMARY KEY (`idProduct_Variations`),
  ADD KEY `Product_idProduct` (`Product_idProduct`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`idReview`),
  ADD KEY `Customer_idCustomer` (`Customer_idCustomer`),
  ADD KEY `Product_idProduct` (`Product_idProduct`);

--
-- Indexes for table `sub_category`
--
ALTER TABLE `sub_category`
  ADD PRIMARY KEY (`idSub_Category`),
  ADD KEY `Product_Category_idProduct_Category` (`Product_Category_idProduct_Category`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_us_setting`
--
ALTER TABLE `about_us_setting`
  MODIFY `idAbout_Us_Setting` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `idCart` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `idCities` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `idCustomer` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_address`
--
ALTER TABLE `delivery_address`
  MODIFY `idDelivery_Address` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts`
  MODIFY `idDiscounts` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `idEvent` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_discounts`
--
ALTER TABLE `event_discounts`
  MODIFY `idEvent_Discounts` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `idFAQ` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `header_footer_setting`
--
ALTER TABLE `header_footer_setting`
  MODIFY `idHeader_Footer_Setting` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `idOrder` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `idProduct` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_brand`
--
ALTER TABLE `product_brand`
  MODIFY `idProduct_Brand` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `idProduct_Category` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `idProduct_Images` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_variations`
--
ALTER TABLE `product_variations`
  MODIFY `idProduct_Variations` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `idReview` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_category`
--
ALTER TABLE `sub_category`
  MODIFY `idSub_Category` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`idUser`);

--
-- Constraints for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD CONSTRAINT `admin_notifications_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`idUser`);

--
-- Constraints for table `admin_notification_status`
--
ALTER TABLE `admin_notification_status`
  ADD CONSTRAINT `admin_notification_status_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `admin_notifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `admin_notification_status_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `user` (`idUser`);

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`Customer_idCustomer`) REFERENCES `customer` (`idCustomer`);

--
-- Constraints for table `cart_has_product`
--
ALTER TABLE `cart_has_product`
  ADD CONSTRAINT `cart_has_product_ibfk_1` FOREIGN KEY (`Cart_idCart`) REFERENCES `cart` (`idCart`),
  ADD CONSTRAINT `cart_has_product_ibfk_2` FOREIGN KEY (`Product_Variations_idProduct_Variations`) REFERENCES `product_variations` (`idProduct_Variations`),
  ADD CONSTRAINT `fk_cart_event_discount` FOREIGN KEY (`Event_Discounts_idEvent_Discounts`) REFERENCES `event_discounts` (`idEvent_Discounts`) ON DELETE SET NULL;

--
-- Constraints for table `delivery_address`
--
ALTER TABLE `delivery_address`
  ADD CONSTRAINT `delivery_address_ibfk_1` FOREIGN KEY (`Customer_idCustomer`) REFERENCES `customer` (`idCustomer`);

--
-- Constraints for table `discounts`
--
ALTER TABLE `discounts`
  ADD CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`);

--
-- Constraints for table `event_discounts`
--
ALTER TABLE `event_discounts`
  ADD CONSTRAINT `event_discounts_ibfk_1` FOREIGN KEY (`Event_idEvent`) REFERENCES `event` (`idEvent`) ON DELETE CASCADE;

--
-- Constraints for table `event_has_product`
--
ALTER TABLE `event_has_product`
  ADD CONSTRAINT `event_has_product_ibfk_1` FOREIGN KEY (`Event_idEvent`) REFERENCES `event` (`idEvent`),
  ADD CONSTRAINT `event_has_product_ibfk_2` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`);

--
-- Constraints for table `faq`
--
ALTER TABLE `faq`
  ADD CONSTRAINT `faq_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`Delivery_Address_idDelivery_Address`) REFERENCES `delivery_address` (`idDelivery_Address`);

--
-- Constraints for table `order_has_product_variations`
--
ALTER TABLE `order_has_product_variations`
  ADD CONSTRAINT `fk_order_event_discount` FOREIGN KEY (`Event_Discounts_idEvent_Discounts`) REFERENCES `event_discounts` (`idEvent_Discounts`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_has_product_variations_ibfk_1` FOREIGN KEY (`Order_idOrder`) REFERENCES `order` (`idOrder`),
  ADD CONSTRAINT `order_has_product_variations_ibfk_2` FOREIGN KEY (`Product_Variations_idProduct_Variations`) REFERENCES `product_variations` (`idProduct_Variations`),
  ADD CONSTRAINT `order_has_product_variations_ibfk_3` FOREIGN KEY (`Discounts_idDiscounts`) REFERENCES `discounts` (`idDiscounts`);

--
-- Constraints for table `order_history`
--
ALTER TABLE `order_history`
  ADD CONSTRAINT `order_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`idOrder`),
  ADD CONSTRAINT `order_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `user` (`idUser`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`Product_Brand_idProduct_Brand`) REFERENCES `product_brand` (`idProduct_Brand`);

--
-- Constraints for table `product_brand`
--
ALTER TABLE `product_brand`
  ADD CONSTRAINT `product_brand_ibfk_1` FOREIGN KEY (`User_idUser`) REFERENCES `user` (`idUser`);

--
-- Constraints for table `product_has_sub_category`
--
ALTER TABLE `product_has_sub_category`
  ADD CONSTRAINT `product_has_sub_category_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`),
  ADD CONSTRAINT `product_has_sub_category_ibfk_2` FOREIGN KEY (`Sub_Category_idSub_Category`) REFERENCES `sub_category` (`idSub_Category`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`);

--
-- Constraints for table `product_variations`
--
ALTER TABLE `product_variations`
  ADD CONSTRAINT `product_variations_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`Customer_idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`);

--
-- Constraints for table `sub_category`
--
ALTER TABLE `sub_category`
  ADD CONSTRAINT `sub_category_ibfk_1` FOREIGN KEY (`Product_Category_idProduct_Category`) REFERENCES `product_category` (`idProduct_Category`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
