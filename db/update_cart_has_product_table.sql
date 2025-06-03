-- Updated the cart_has_product table to include a new column for market price.

ALTER TABLE cart_has_product
ADD COLUMN Market_Rate FLOAT(10,2) DEFAULT NULL;