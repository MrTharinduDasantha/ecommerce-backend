-- Add Delivery_Date column to the Order table
ALTER TABLE `Order` 
ADD COLUMN Delivery_Date DATE NULL 
AFTER Delivery_Status;

-- Create an index for faster queries on delivery date
CREATE INDEX idx_order_delivery_date ON `Order`(Delivery_Date); 