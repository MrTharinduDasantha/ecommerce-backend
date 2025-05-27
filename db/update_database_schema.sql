-- Add Seasonal_Offer, Rush_Delivery, and For_You column to the Product table
ALTER TABLE Product
ADD COLUMN Seasonal_Offer TINYINT DEFAULT 0 AFTER Status,
ADD COLUMN Rush_Delivery TINYINT DEFAULT 0 AFTER Seasonal_Offer,
ADD COLUMN For_You TINYINT DEFAULT 0 AFTER Rush_Delivery;

-- Add Delivery_Date column to the Order table
ALTER TABLE `Order` 
ADD COLUMN Delivery_Date DATE NULL 
AFTER Delivery_Status;

-- Change the name of the Dicaunt_Type column in the Discounts table to Discount_Type
ALTER TABLE Discounts CHANGE Dicaunt_Type Discount_Type VARCHAR(45);

-- Add reset_password_otp and reset_password_otp_expires columns to the Customer table
ALTER TABLE Customer
ADD COLUMN reset_password_otp VARCHAR(10) NULL,
ADD COLUMN reset_password_otp_expires TIMESTAMP NULL;

-- Modify the Password column in the Customer table to have a maximum length of 255 characters
ALTER TABLE Customer MODIFY COLUMN Password VARCHAR(255);