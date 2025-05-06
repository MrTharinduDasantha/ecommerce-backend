-- Order History Table for tracking all order status changes, payment status changes, and cancellations
-- This table provides a complete chronological history of each order's lifecycle

CREATE TABLE IF NOT EXISTS Order_History (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status_from VARCHAR(45),
    status_to VARCHAR(45), 
    status_type VARCHAR(45), -- 'order_status', 'payment_status', 'delivery_status', 'cancellation'
    reason TEXT,
    notes TEXT,
    changed_by INT, -- User/Admin ID who made the change
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically captures the exact time of change
    FOREIGN KEY (order_id) REFERENCES `Order`(idOrder),
    FOREIGN KEY (changed_by) REFERENCES User(idUser)
);

-- Optional index for faster queries on order_id
CREATE INDEX idx_order_history_order_id ON Order_History(order_id);

-- Example queries for using this table:

-- 1. Get complete history of a specific order
-- SELECT * FROM Order_History WHERE order_id = ? ORDER BY created_at ASC;

-- 2. Get all status changes for a specific order type (e.g., only order_status changes)
-- SELECT * FROM Order_History WHERE order_id = ? AND status_type = 'order_status' ORDER BY created_at ASC;

-- 3. Get all orders that were cancelled with reasons
-- SELECT o.idOrder, o.Total_Amount, da.Full_Name, da.City, oh.reason, oh.created_at
-- FROM Order_History oh
-- JOIN `Order` o ON oh.order_id = o.idOrder
-- JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
-- WHERE oh.status_to = 'Cancelled' AND oh.status_type = 'cancellation'
-- ORDER BY oh.created_at DESC;

-- 4. Get delivery timeline for an order
-- SELECT status_from, status_to, created_at
-- FROM Order_History
-- WHERE order_id = ? AND status_type = 'order_status'
-- ORDER BY created_at ASC;

-- Example INSERT statements for typical order flow:

-- When order is first placed (assume order_id = 1, admin_id = 1)
-- INSERT INTO Order_History (order_id, status_from, status_to, status_type, notes, changed_by)
-- VALUES (1, NULL, 'Order Confirmed', 'order_status', 'Order placed by customer', 1);

-- When payment is received
-- INSERT INTO Order_History (order_id, status_from, status_to, status_type, notes, changed_by)
-- VALUES (1, 'pending', 'paid', 'payment_status', 'Payment successful via credit card', 1);

-- When order is packed
-- INSERT INTO Order_History (order_id, status_from, status_to, status_type, notes, changed_by)
-- VALUES (1, 'Order Confirmed', 'Order Packed', 'order_status', 'All items verified and packed', 1);

-- When order is out for delivery
-- INSERT INTO Order_History (order_id, status_from, status_to, status_type, notes, changed_by)
-- VALUES (1, 'Order Packed', 'Out for Delivery', 'order_status', 'Handed to shipping partner', 1);

-- When order is delivered
-- INSERT INTO Order_History (order_id, status_from, status_to, status_type, notes, changed_by)
-- VALUES (1, 'Out for Delivery', 'Delivered', 'order_status', 'Customer confirmed receipt', 1);

-- Example of a cancelled order with reason
-- INSERT INTO Order_History (order_id, status_from, status_to, status_type, reason, notes, changed_by)
-- VALUES (2, 'Order Confirmed', 'Cancelled', 'cancellation', 'Customer requested to cancel due to delivery delay', 'Refund processed', 1); 