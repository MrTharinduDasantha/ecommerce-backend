CREATE DATABASE IF NOT EXISTS medusa_ecommerce;
USE medusa_ecommerce;

-- User Table
CREATE TABLE User (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    Full_Name VARCHAR(45),
    Email VARCHAR(45),
    Password VARCHAR(45),
    Phone_No VARCHAR(45),
    Status VARCHAR(45)
);

-- Customer Table
CREATE TABLE Customer (
    idCustomer INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(45),
    Full_Name VARCHAR(45),
    Address TEXT,
    City VARCHAR(45),
    Country VARCHAR(45),
    Mobile_No VARCHAR(45),
    Status VARCHAR(45),
    Email VARCHAR(45),
    Password VARCHAR(45)
);

-- Cities Table
CREATE TABLE Cities (
    idCities INT AUTO_INCREMENT PRIMARY KEY,
    Country VARCHAR(45),
    City VARCHAR(45)
);

-- Delivery_Address Table
CREATE TABLE Delivery_Address (
    idDelivery_Address INT AUTO_INCREMENT PRIMARY KEY,
    Customer_idCustomer INT,
    Full_Name VARCHAR(45),
    Address TEXT,
    City VARCHAR(45),
    Country VARCHAR(45),
    Mobile_No VARCHAR(45),
    FOREIGN KEY (Customer_idCustomer) REFERENCES Customer(idCustomer)
);

-- Product_Brand Table
CREATE TABLE Product_Brand (
    idProduct_Brand INT AUTO_INCREMENT PRIMARY KEY,
    Brand_Name VARCHAR(45),
    ShortDescription TEXT,
    User_idUser INT,
    FOREIGN KEY (User_idUser) REFERENCES User(idUser)
);

-- Product_Category Table
CREATE TABLE Product_Category (
    idProduct_Category INT AUTO_INCREMENT PRIMARY KEY,
    Image_Icon_Url VARCHAR(45),
    Description VARCHAR(45),
    Status VARCHAR(45) DEFAULT 'active'
);

-- Sub_Category Table
CREATE TABLE Sub_Category (
    idSub_Category INT AUTO_INCREMENT PRIMARY KEY,
    Description VARCHAR(45),
    Product_Category_idProduct_Category INT,
    FOREIGN KEY (Product_Category_idProduct_Category) REFERENCES Product_Category(idProduct_Category)
);

-- Product Table
CREATE TABLE Product (
    idProduct INT AUTO_INCREMENT PRIMARY KEY,
    Description VARCHAR(45),
    Product_Brand_idProduct_Brand INT,
    Market_Price DECIMAL(10,2),
    Selling_Price DECIMAL(10,2),
    Main_Image_Url TEXT,
    Long_Description TEXT,
    SKU VARCHAR(45),
    Sold_Qty INT,
    Latest_Rating DECIMAL(3,1),
    FOREIGN KEY (Product_Brand_idProduct_Brand) REFERENCES Product_Brand(idProduct_Brand)
);

-- Product_Images Table
CREATE TABLE Product_Images (
    idProduct_Images INT AUTO_INCREMENT PRIMARY KEY,
    Product_idProduct INT,
    Image_Url VARCHAR(45),
    FOREIGN KEY (Product_idProduct) REFERENCES Product(idProduct)
);

-- Product_has_Sub_Category Table
CREATE TABLE Product_has_Sub_Category (
    Product_idProduct INT,
    Sub_Category_idSub_Category INT,
    PRIMARY KEY (Product_idProduct, Sub_Category_idSub_Category),
    FOREIGN KEY (Product_idProduct) REFERENCES Product(idProduct),
    FOREIGN KEY (Sub_Category_idSub_Category) REFERENCES Sub_Category(idSub_Category)
);

-- Cart Table
CREATE TABLE Cart (
    idCart INT AUTO_INCREMENT PRIMARY KEY,
    Customer_idCustomer INT,
    Total_Items INT,
    Total_Amount DECIMAL(10,2),
    FOREIGN KEY (Customer_idCustomer) REFERENCES Customer(idCustomer)
);

-- Product_Variations Table
CREATE TABLE Product_Variations (
    idProduct_Variations INT AUTO_INCREMENT PRIMARY KEY,
    Product_idProduct INT,
    Colour VARCHAR(45),
    Size VARCHAR(45),
    Rate DECIMAL(10,2),
    SKU VARCHAR(45),
    FOREIGN KEY (Product_idProduct) REFERENCES Product(idProduct)
);

-- Cart_has_Product Table
CREATE TABLE Cart_has_Product (
    Cart_idCart INT,
    Product_Variations_idProduct_Variations INT,
    Rate DECIMAL(10,2),
    Qty INT,
    Total_Amount DECIMAL(10,2),
    Discount_Percentage DECIMAL(5,2),
    Discount_Amount DECIMAL(10,2),
    NetAmount DECIMAL(10,2),
    Note TEXT,
    Discounts_idDiscounts INT,
    PRIMARY KEY (Cart_idCart, Product_Variations_idProduct_Variations),
    FOREIGN KEY (Cart_idCart) REFERENCES Cart(idCart),
    FOREIGN KEY (Product_Variations_idProduct_Variations) REFERENCES Product_Variations(idProduct_Variations)
);

-- Discounts Table
CREATE TABLE Discounts (
    idDiscounts INT AUTO_INCREMENT PRIMARY KEY,
    Product_idProduct INT,
    Description VARCHAR(45),
    Dicaunt_Type VARCHAR(45),
    Discount_Value DECIMAL(10,2),
    Start_Date VARCHAR(45),
    End_Date VARCHAR(45),
    Status VARCHAR(45),
    FOREIGN KEY (Product_idProduct) REFERENCES Product(idProduct)
);

-- Order Table
CREATE TABLE `Order` (
    idOrder INT AUTO_INCREMENT PRIMARY KEY,
    Date_Time VARCHAR(45),
    Delivery_Address_idDelivery_Address INT,
    Total_Amount DECIMAL(10,2),
    Delivery_Type VARCHAR(45),
    Delivery_Charges DECIMAL(10,2),
    Net_Amount DECIMAL(10,2),
    Payment_Type VARCHAR(45),
    Payment_Stats VARCHAR(45),
    Delivery_Status VARCHAR(45),
    Status VARCHAR(45),
    Customer_Note TEXT,
    Supplier_Note TEXT,
    FOREIGN KEY (Delivery_Address_idDelivery_Address) REFERENCES Delivery_Address(idDelivery_Address)
);

-- Order_has_Product_Variations Table
CREATE TABLE Order_has_Product_Variations (
    Order_idOrder INT,
    Product_Variations_idProduct_Variations INT,
    Rate DECIMAL(10,2),
    Qty INT,
    Total DECIMAL(10,2),
    Discount_Percentage DECIMAL(5,2),
    Discount_Amount DECIMAL(10,2),
    Total_Amount DECIMAL(10,2),
    Note TEXT,
    Discounts_idDiscounts INT,
    PRIMARY KEY (Order_idOrder, Product_Variations_idProduct_Variations),
    FOREIGN KEY (Order_idOrder) REFERENCES `Order`(idOrder),
    FOREIGN KEY (Product_Variations_idProduct_Variations) REFERENCES Product_Variations(idProduct_Variations),
    FOREIGN KEY (Discounts_idDiscounts) REFERENCES Discounts(idDiscounts)
);

-- Review Table
CREATE TABLE Review (
    idReview INT AUTO_INCREMENT PRIMARY KEY,
    Customer_idCustomer INT,
    Product_idProduct INT,
    Rating_5 DECIMAL(2,1),
    Comment VARCHAR(45),
    Date_Time VARCHAR(45),
    Status VARCHAR(45),
    FOREIGN KEY (Customer_idCustomer) REFERENCES Customer(idCustomer),
    FOREIGN KEY (Product_idProduct) REFERENCES Product(idProduct)
);

-- FAQ Table
CREATE TABLE FAQ (
    idFAQ INT AUTO_INCREMENT PRIMARY KEY,
    Question TEXT,
    Answer TEXT,
    Product_idProduct INT,
    FOREIGN KEY (Product_idProduct) REFERENCES Product(idProduct)
); 
