ALTER TABLE Customer
ADD COLUMN reset_password_otp VARCHAR(10) NULL,
ADD COLUMN reset_password_otp_expires TIMESTAMP NULL;

ALTER TABLE Customer MODIFY COLUMN Password VARCHAR(255);