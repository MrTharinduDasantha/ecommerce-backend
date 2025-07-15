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

ALTER TABLE User ADD CONSTRAINT unique_email UNIQUE (Email);

-- Add Nav_Icons, Country_Blocks, Footer_Links, and Social_Icons columns to the Header_Footer_Setting table
ALTER TABLE Header_Footer_Setting
ADD COLUMN Nav_Icons JSON AFTER Navbar_Logo_Url,
ADD COLUMN Country_Blocks JSON AFTER Nav_Icons,
ADD COLUMN Footer_Links JSON AFTER Country_Blocks,
ADD COLUMN Social_Icons JSON AFTER Footer_Links;

-- Add Market_Rate column to the cart_has_product table
ALTER TABLE cart_has_product
ADD COLUMN Market_Rate FLOAT(10,2) DEFAULT NULL AFTER Rate;

-- Add Birthday column to the Customer table
ALTER TABLE Customer 
ADD COLUMN Birthday DATE NULL AFTER Full_Name;

-- Add a new Event Table
CREATE TABLE Event (
    idEvent INT AUTO_INCREMENT PRIMARY KEY,
    Event_Name VARCHAR(100),
    Event_Description TEXT,
    Event_Image_Url TEXT,
    Status VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add a new Event_has_Product Table
CREATE TABLE Event_has_Product (
    Event_idEvent INT,
    Product_idProduct INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Event_idEvent, Product_idProduct),
    FOREIGN KEY (Event_idEvent) REFERENCES Event(idEvent),
    FOREIGN KEY (Product_idProduct) REFERENCES Product(idProduct)
);

-- Add a new About Us Setting Table
CREATE TABLE About_Us_Setting (
  idAbout_Us_Setting INT AUTO_INCREMENT PRIMARY KEY,
  Statistics JSON,
  Vision_Image_Url TEXT,
  Vision_Title VARCHAR(255),
  Vision_Description TEXT,
  Mission_Image_Url TEXT,
  Mission_Title VARCHAR(255),
  Mission_Description TEXT,
  Values_Image_Url TEXT,
  Values_Title VARCHAR(255),
  Values_Description TEXT,
  Features JSON,
  Why_Choose_Us_Image_Url TEXT,
  Shopping_Experience_Title VARCHAR(255),
  Shopping_Experience_Description TEXT,
  Shopping_Experience_Button_Text VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add a new Order Review table
CREATE TABLE order_review (
    review_id INT(11) NOT NULL AUTO_INCREMENT,
    customer_id INT(11),
    order_id INT(11),
    rating DECIMAL(2,1),
    comment VARCHAR(1000),
    status VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (review_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(idCustomer),
    FOREIGN KEY (order_id) REFERENCES Order(idOrder)
  );
  
-- Add a new Event_Discounts Table
CREATE TABLE Event_Discounts (
    idEvent_Discounts INT AUTO_INCREMENT PRIMARY KEY,
    Event_idEvent INT NOT NULL,
    Product_Ids TEXT NOT NULL, 
    Description VARCHAR(255) NOT NULL,
    Discount_Type VARCHAR(45) NOT NULL,
    Discount_Value DECIMAL(10,2) NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Status VARCHAR(45) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Event_idEvent) REFERENCES Event(idEvent) ON DELETE CASCADE
);

-- Add a new Policy Details Setting Table
CREATE TABLE IF NOT EXISTS Policy_Details_Setting (
  idPolicy_Details_Setting INT AUTO_INCREMENT PRIMARY KEY,
  Legal_Policy_Content LONGTEXT,
  Privacy_Policy_Content LONGTEXT,
  Security_Policy_Content LONGTEXT,
  Terms_Of_Service_Content LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add a new Home Page Settings Table
CREATE TABLE Home_Page_Setting (
  idHome_Page_Setting INT AUTO_INCREMENT PRIMARY KEY,
  Hero_Images JSON,
  Working_Section_Title VARCHAR(255),
  Working_Section_Description TEXT,
  Working_Items JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);