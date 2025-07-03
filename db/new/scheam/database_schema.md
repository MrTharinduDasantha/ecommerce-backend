# Medusa E-commerce Database Schema

## Database Information
- **Database Name**: medusa_ecommerce
- **Engine**: MySQL 8.0.41
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_general_ci

## Tables Overview

This e-commerce database contains 27 tables organized into the following categories:
- **User Management**: user, customer, admin_logs, admin_notifications, admin_notification_status
- **Product Management**: product, product_brand, product_category, sub_category, product_variations, product_images, product_has_sub_category, faq
- **Order Management**: order, order_has_product_variations, order_history, cart, cart_has_product
- **Marketing**: discounts, event, event_discounts, event_has_product, review
- **System Configuration**: about_us_setting, header_footer_setting
- **Location**: cities, delivery_address

---

## Table Definitions

### 1. USER MANAGEMENT TABLES

#### `user`
**Purpose**: System administrators and staff users
```sql
CREATE TABLE `user` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `Full_Name` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Phone_No` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `Otp` varchar(6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUser`)
)
```

#### `customer`
**Purpose**: Customer/buyer accounts
```sql
CREATE TABLE `customer` (
  `idCustomer` int NOT NULL AUTO_INCREMENT,
  `First_Name` varchar(45) DEFAULT NULL,
  `Full_Name` varchar(45) DEFAULT NULL,
  `Birthday` date DEFAULT NULL,
  `Address` text,
  `City` varchar(45) DEFAULT NULL,
  `Country` varchar(45) DEFAULT NULL,
  `Mobile_No` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `reset_password_otp` varchar(10) DEFAULT NULL,
  `reset_password_otp_expires` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCustomer`)
)
```

#### `admin_logs`
**Purpose**: Track admin user activities and actions
```sql
CREATE TABLE `admin_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `new_user_info` mediumtext,
  `device_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`idUser`)
)
```

#### `admin_notifications`
**Purpose**: System notifications for administrators
```sql
CREATE TABLE `admin_notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `admin_notifications_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`idUser`)
)
```

#### `admin_notification_status`
**Purpose**: Track read status of notifications by admin users
```sql
CREATE TABLE `admin_notification_status` (
  `notification_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`,`admin_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_notification_status_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `admin_notifications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `admin_notification_status_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `user` (`idUser`)
)
```

---

### 2. PRODUCT MANAGEMENT TABLES

#### `product`
**Purpose**: Main product catalog
```sql
CREATE TABLE `product` (
  `idProduct` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(45) DEFAULT NULL,
  `Product_Brand_idProduct_Brand` int DEFAULT NULL,
  `Market_Price` decimal(10,2) DEFAULT NULL,
  `Selling_Price` decimal(10,2) DEFAULT NULL,
  `Main_Image_Url` text,
  `Long_Description` text,
  `SIH` varchar(45) DEFAULT NULL,
  `Sold_Qty` int DEFAULT '0',
  `Latest_Rating` decimal(3,1) DEFAULT '0.0',
  `History_Status` varchar(45) DEFAULT 'new arrivals',
  `Status` varchar(45) DEFAULT 'active',
  `Seasonal_Offer` tinyint DEFAULT '0',
  `Rush_Delivery` tinyint DEFAULT '0',
  `For_You` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idProduct`),
  FOREIGN KEY (`Product_Brand_idProduct_Brand`) REFERENCES `product_brand` (`idProduct_Brand`)
)
```

#### `product_brand`
**Purpose**: Product brands/manufacturers
```sql
CREATE TABLE `product_brand` (
  `idProduct_Brand` int NOT NULL AUTO_INCREMENT,
  `Brand_Name` varchar(45) DEFAULT NULL,
  `Brand_Image_Url` text,
  `ShortDescription` text,
  `User_idUser` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idProduct_Brand`),
  KEY `User_idUser` (`User_idUser`),
  CONSTRAINT `product_brand_ibfk_1` FOREIGN KEY (`User_idUser`) REFERENCES `user` (`idUser`)
)
```

#### `product_category`
**Purpose**: Main product categories
```sql
CREATE TABLE `product_category` (
  `idProduct_Category` int NOT NULL AUTO_INCREMENT,
  `Image_Icon_Url` varchar(255) DEFAULT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idProduct_Category`)
)
```

#### `sub_category`
**Purpose**: Sub-categories under main categories
```sql
CREATE TABLE `sub_category` (
  `idSub_Category` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(45) DEFAULT NULL,
  `Product_Category_idProduct_Category` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idSub_Category`),
  KEY `Product_Category_idProduct_Category` (`Product_Category_idProduct_Category`),
  CONSTRAINT `sub_category_ibfk_1` FOREIGN KEY (`Product_Category_idProduct_Category`) REFERENCES `product_category` (`idProduct_Category`)
)
```

#### `product_has_sub_category`
**Purpose**: Many-to-many relationship between products and sub-categories
```sql
CREATE TABLE `product_has_sub_category` (
  `Product_idProduct` int NOT NULL,
  `Sub_Category_idSub_Category` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Product_idProduct`,`Sub_Category_idSub_Category`),
  KEY `Sub_Category_idSub_Category` (`Sub_Category_idSub_Category`),
  CONSTRAINT `product_has_sub_category_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`),
  CONSTRAINT `product_has_sub_category_ibfk_2` FOREIGN KEY (`Sub_Category_idSub_Category`) REFERENCES `sub_category` (`idSub_Category`)
)
```

#### `product_variations`
**Purpose**: Product variants (color, size, quantity)
```sql
CREATE TABLE `product_variations` (
  `idProduct_Variations` int NOT NULL AUTO_INCREMENT,
  `Product_idProduct` int DEFAULT NULL,
  `Colour` varchar(45) DEFAULT NULL,
  `Size` varchar(45) DEFAULT NULL,
  `Qty` int DEFAULT NULL,
  `Rate` decimal(10,2) DEFAULT '0.00',
  `SIH` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idProduct_Variations`),
  KEY `Product_idProduct` (`Product_idProduct`),
  CONSTRAINT `product_variations_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`)
)
```

#### `product_images`
**Purpose**: Additional product images
```sql
CREATE TABLE `product_images` (
  `idProduct_Images` int NOT NULL AUTO_INCREMENT,
  `Product_idProduct` int DEFAULT NULL,
  `Image_Url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idProduct_Images`),
  KEY `Product_idProduct` (`Product_idProduct`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`)
)
```

#### `faq`
**Purpose**: Frequently asked questions for products
```sql
CREATE TABLE `faq` (
  `idFAQ` int NOT NULL AUTO_INCREMENT,
  `Question` text,
  `Answer` text,
  `Product_idProduct` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idFAQ`),
  KEY `Product_idProduct` (`Product_idProduct`),
  CONSTRAINT `faq_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`)
)
```

---

### 3. ORDER MANAGEMENT TABLES

#### `cart`
**Purpose**: Customer shopping carts
```sql
CREATE TABLE `cart` (
  `idCart` int NOT NULL AUTO_INCREMENT,
  `Customer_idCustomer` int DEFAULT NULL,
  `Total_Items` int DEFAULT NULL,
  `Total_Amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCart`),
  KEY `Customer_idCustomer` (`Customer_idCustomer`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`Customer_idCustomer`) REFERENCES `customer` (`idCustomer`)
)
```

#### `cart_has_product`
**Purpose**: Items in customer carts
```sql
CREATE TABLE `cart_has_product` (
  `Cart_idCart` int NOT NULL,
  `Product_Variations_idProduct_Variations` int NOT NULL,
  `Rate` decimal(10,2) DEFAULT NULL,
  `Market_Rate` float(10,2) DEFAULT NULL,
  `Qty` int DEFAULT NULL,
  `Total_Amount` decimal(10,2) DEFAULT NULL,
  `Discount_Percentage` decimal(5,2) DEFAULT NULL,
  `Discount_Amount` decimal(10,2) DEFAULT NULL,
  `NetAmount` decimal(10,2) DEFAULT NULL,
  `Note` text,
  `Discounts_idDiscounts` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Cart_idCart`,`Product_Variations_idProduct_Variations`),
  KEY `Product_Variations_idProduct_Variations` (`Product_Variations_idProduct_Variations`),
  CONSTRAINT `cart_has_product_ibfk_1` FOREIGN KEY (`Cart_idCart`) REFERENCES `cart` (`idCart`),
  CONSTRAINT `cart_has_product_ibfk_2` FOREIGN KEY (`Product_Variations_idProduct_Variations`) REFERENCES `product_variations` (`idProduct_Variations`)
)
```

#### `order`
**Purpose**: Customer orders
```sql
CREATE TABLE `order` (
  `idOrder` int NOT NULL AUTO_INCREMENT,
  `Date_Time` varchar(45) DEFAULT NULL,
  `Delivery_Address_idDelivery_Address` int DEFAULT NULL,
  `Total_Amount` decimal(10,2) DEFAULT NULL,
  `Delivery_Type` varchar(45) DEFAULT NULL,
  `Delivery_Charges` decimal(10,2) DEFAULT NULL,
  `Net_Amount` decimal(10,2) DEFAULT NULL,
  `Payment_Type` varchar(45) DEFAULT NULL,
  `Payment_Stats` varchar(45) DEFAULT NULL,
  `Delivery_Status` varchar(45) DEFAULT NULL,
  `Delivery_Date` date DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `Customer_Note` text,
  `Supplier_Note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idOrder`),
  FOREIGN KEY (`Delivery_Address_idDelivery_Address`) REFERENCES `delivery_address` (`idDelivery_Address`)
)
```

#### `order_has_product_variations`
**Purpose**: Items in orders with their details
```sql
CREATE TABLE `order_has_product_variations` (
  `Order_idOrder` int NOT NULL,
  `Product_Variations_idProduct_Variations` int NOT NULL,
  `Rate` decimal(10,2) DEFAULT NULL,
  `Qty` int DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Discount_Percentage` decimal(5,2) DEFAULT NULL,
  `Discount_Amount` decimal(10,2) DEFAULT NULL,
  `NetAmount` decimal(10,2) DEFAULT NULL,
  `Discounts_idDiscounts` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Order_idOrder`,`Product_Variations_idProduct_Variations`),
  KEY `Product_Variations_idProduct_Variations` (`Product_Variations_idProduct_Variations`),
  CONSTRAINT `order_has_product_variations_ibfk_1` FOREIGN KEY (`Order_idOrder`) REFERENCES `order` (`idOrder`),
  CONSTRAINT `order_has_product_variations_ibfk_2` FOREIGN KEY (`Product_Variations_idProduct_Variations`) REFERENCES `product_variations` (`idProduct_Variations`)
)
```

#### `order_history`
**Purpose**: Track order status changes and updates
```sql
CREATE TABLE `order_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `old_value` varchar(255) DEFAULT NULL,
  `new_value` varchar(255) DEFAULT NULL,
  `change_type` varchar(50) NOT NULL,
  `note` text,
  `description` text,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `order_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`idOrder`) ON DELETE CASCADE,
  CONSTRAINT `order_history_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `user` (`idUser`)
)
```

#### `delivery_address`
**Purpose**: Customer delivery addresses
```sql
CREATE TABLE `delivery_address` (
  `idDelivery_Address` int NOT NULL AUTO_INCREMENT,
  `Customer_idCustomer` int DEFAULT NULL,
  `Full_Name` varchar(45) DEFAULT NULL,
  `Address` text,
  `City` varchar(45) DEFAULT NULL,
  `Country` varchar(45) DEFAULT NULL,
  `Mobile_No` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idDelivery_Address`),
  KEY `Customer_idCustomer` (`Customer_idCustomer`),
  CONSTRAINT `delivery_address_ibfk_1` FOREIGN KEY (`Customer_idCustomer`) REFERENCES `customer` (`idCustomer`)
)
```

---

### 4. MARKETING & PROMOTIONAL TABLES

#### `discounts`
**Purpose**: Product-specific discounts
```sql
CREATE TABLE `discounts` (
  `idDiscounts` int NOT NULL AUTO_INCREMENT,
  `Product_idProduct` int DEFAULT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `Discount_Type` varchar(45) DEFAULT NULL,
  `Discount_Value` decimal(10,2) DEFAULT NULL,
  `Start_Date` varchar(45) DEFAULT NULL,
  `End_Date` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idDiscounts`),
  KEY `Product_idProduct` (`Product_idProduct`),
  CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`)
)
```

#### `event`
**Purpose**: Marketing events and campaigns
```sql
CREATE TABLE `event` (
  `idEvent` int NOT NULL AUTO_INCREMENT,
  `Event_Name` varchar(100) DEFAULT NULL,
  `Event_Description` text,
  `Event_Image_Url` text,
  `Status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idEvent`)
)
```

#### `event_discounts`
**Purpose**: Discounts associated with events
```sql
CREATE TABLE `event_discounts` (
  `idEvent_Discounts` int NOT NULL AUTO_INCREMENT,
  `Event_idEvent` int NOT NULL,
  `Product_Ids` text NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Discount_Type` varchar(45) NOT NULL,
  `Discount_Value` decimal(10,2) NOT NULL,
  `Start_Date` date NOT NULL,
  `End_Date` date NOT NULL,
  `Status` varchar(45) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idEvent_Discounts`),
  KEY `Event_idEvent` (`Event_idEvent`),
  CONSTRAINT `event_discounts_ibfk_1` FOREIGN KEY (`Event_idEvent`) REFERENCES `event` (`idEvent`) ON DELETE CASCADE
)
```

#### `event_has_product`
**Purpose**: Products associated with events
```sql
CREATE TABLE `event_has_product` (
  `Event_idEvent` int NOT NULL,
  `Product_idProduct` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Event_idEvent`,`Product_idProduct`),
  KEY `Product_idProduct` (`Product_idProduct`),
  CONSTRAINT `event_has_product_ibfk_1` FOREIGN KEY (`Event_idEvent`) REFERENCES `event` (`idEvent`),
  CONSTRAINT `event_has_product_ibfk_2` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`)
)
```

#### `review`
**Purpose**: Customer product reviews and ratings
```sql
CREATE TABLE `review` (
  `idReview` int NOT NULL AUTO_INCREMENT,
  `Customer_idCustomer` int DEFAULT NULL,
  `Product_idProduct` int DEFAULT NULL,
  `Rating_5` decimal(2,1) DEFAULT NULL,
  `Comment` varchar(45) DEFAULT NULL,
  `Date_Time` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idReview`),
  KEY `Customer_idCustomer` (`Customer_idCustomer`),
  KEY `Product_idProduct` (`Product_idProduct`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`Customer_idCustomer`) REFERENCES `customer` (`idCustomer`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`Product_idProduct`) REFERENCES `product` (`idProduct`)
)
```

---

### 5. SYSTEM CONFIGURATION TABLES

#### `about_us_setting`
**Purpose**: About us page configuration
```sql
CREATE TABLE `about_us_setting` (
  `idAbout_Us_Setting` int NOT NULL AUTO_INCREMENT,
  `Statistics` json DEFAULT NULL,
  `Vision_Image_Url` text,
  `Vision_Title` varchar(255) DEFAULT NULL,
  `Vision_Description` text,
  `Mission_Image_Url` text,
  `Mission_Title` varchar(255) DEFAULT NULL,
  `Mission_Description` text,
  `Values_Image_Url` text,
  `Values_Title` varchar(255) DEFAULT NULL,
  `Values_Description` text,
  `Features` json DEFAULT NULL,
  `Why_Choose_Us_Image_Url` text,
  `Shopping_Experience_Title` varchar(255) DEFAULT NULL,
  `Shopping_Experience_Description` text,
  `Shopping_Experience_Button_Text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idAbout_Us_Setting`)
)
```

#### `header_footer_setting`
**Purpose**: Website header and footer configuration
```sql
CREATE TABLE `header_footer_setting` (
  `idHeader_Footer_Setting` int NOT NULL AUTO_INCREMENT,
  `Navbar_Logo_Url` text,
  `Nav_Icons` json DEFAULT NULL,
  `Country_Blocks` json DEFAULT NULL,
  `Footer_Links` json DEFAULT NULL,
  `Social_Icons` json DEFAULT NULL,
  `Footer_Copyright` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idHeader_Footer_Setting`)
)
```

#### `cities`
**Purpose**: Available cities for delivery
```sql
CREATE TABLE `cities` (
  `idCities` int NOT NULL AUTO_INCREMENT,
  `Country` varchar(45) DEFAULT NULL,
  `City` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCities`)
)
```

---

## Key Relationships

### Primary Relationships:
1. **User → Admin Logs**: One user can have many admin log entries
2. **Customer → Cart**: One customer can have one active cart
3. **Customer → Delivery Address**: One customer can have multiple delivery addresses
4. **Customer → Orders**: One customer can have multiple orders (via delivery address)
5. **Product → Product Brand**: Many products belong to one brand
6. **Product Category → Sub Category**: One category can have multiple sub-categories
7. **Product → Product Variations**: One product can have multiple variations
8. **Product → Product Images**: One product can have multiple images
9. **Cart → Cart Items**: One cart can contain multiple products (via cart_has_product)
10. **Order → Order Items**: One order can contain multiple products (via order_has_product_variations)

### Many-to-Many Relationships:
1. **Product ↔ Sub Category**: Via `product_has_sub_category`
2. **Event ↔ Product**: Via `event_has_product`
3. **Admin ↔ Notifications**: Via `admin_notification_status`

### Special Features:
- **JSON Fields**: Used for flexible configuration in settings tables
- **Audit Trail**: Most tables include `created_at` and `updated_at` timestamps
- **Soft Deletes**: Status fields used instead of hard deletes
- **Activity Logging**: Admin actions tracked in `admin_logs`
- **Order History**: Complete audit trail for order changes

## Indexes and Constraints

All foreign key relationships are properly indexed for performance. The schema uses:
- **Primary Keys**: Auto-incrementing integers
- **Foreign Key Constraints**: Maintain referential integrity
- **Cascade Deletes**: Where appropriate (e.g., event_discounts, admin_notification_status)
- **Default Values**: Timestamps, status fields, and numerical defaults
- **Character Sets**: UTF8MB4 for full Unicode support 

## Complete Table List

1. **about_us_setting** - About page configuration
2. **admin_logs** - Admin activity tracking
3. **admin_notification_status** - Notification read status
4. **admin_notifications** - System notifications
5. **cart** - Shopping carts
6. **cart_has_product** - Cart items
7. **cities** - Available cities
8. **customer** - Customer accounts
9. **delivery_address** - Customer addresses
10. **discounts** - Product discounts
11. **event** - Marketing events
12. **event_discounts** - Event-based discounts
13. **event_has_product** - Event-product relationships
14. **faq** - Product FAQs
15. **header_footer_setting** - Site configuration
16. **order** - Customer orders
17. **order_has_product_variations** - Order items
18. **order_history** - Order change tracking
19. **product** - Product catalog
20. **product_brand** - Product brands
21. **product_category** - Product categories
22. **product_has_sub_category** - Product-subcategory mapping
23. **product_images** - Product images
24. **product_variations** - Product variants
25. **review** - Product reviews
26. **sub_category** - Product subcategories
27. **user** - Admin users

## Key Features

- **Complete E-commerce Solution**: Supports products, orders, customers, and administration
- **Flexible Product Management**: Categories, subcategories, brands, variations, and images
- **Advanced Marketing**: Events, discounts, reviews, and promotional features
- **Order Management**: Full order lifecycle with history tracking
- **User Management**: Separate admin and customer systems
- **Configuration**: Flexible site settings with JSON fields
- **Audit Trail**: Timestamps and activity logging throughout 