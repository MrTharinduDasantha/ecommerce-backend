const pool = require('../../config/database');

// Customer Address Controller
class AddressController {
  // Get all addresses for a customer
  async getAddresses(req, res) {
    try {
      const customerId = parseInt(req.params.customer_id, 10);
      
      if (isNaN(customerId)) {
        return res.status(400).json({ message: 'Invalid customer ID' });
      }
      
      // Security check: Ensure the customer_id from the params matches the authenticated user
      if (customerId !== req.user.customerId) {
        return res.status(403).json({ message: 'Unauthorized: customer_id does not match authenticated user.' });
      }
      
      console.log("Getting addresses for customer ID:", customerId);
      
      const [addresses] = await pool.query(
        'SELECT * FROM Delivery_Address WHERE Customer_idCustomer = ?',
        [customerId]
      );
      
      res.json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ message: 'Failed to fetch addresses', error: error.message });
    }
  }
  
  // Add a new address for a customer
  async addAddress(req, res) {
    try {
      const customerId = parseInt(req.params.customer_id, 10);
      const { full_name, address, city, country, mobile_no } = req.body;
      
      if (isNaN(customerId)) {
        return res.status(400).json({ message: 'Invalid customer ID' });
      }
      
      // Security check: Ensure the customer_id from the params matches the authenticated user
      if (customerId !== req.user.customerId) {
        return res.status(403).json({ message: 'Unauthorized: customer_id does not match authenticated user.' });
      }
      
      if (!full_name || !address || !city || !country || !mobile_no) {
        return res.status(400).json({ message: 'All fields are required (full_name, address, city, country, mobile_no)' });
      }
      
      console.log("Adding address for customer ID:", customerId);
      
      const [result] = await pool.query(
        'INSERT INTO Delivery_Address (Customer_idCustomer, Full_Name, Address, City, Country, Mobile_No) VALUES (?, ?, ?, ?, ?, ?)',
        [customerId, full_name, address, city, country, mobile_no]
      );
      
      res.status(201).json({ 
        id: result.insertId, 
        message: 'Address added successfully' 
      });
    } catch (error) {
      console.error("Error adding address:", error);
      res.status(500).json({ message: 'Failed to add address', error: error.message });
    }
  }
  
  // Update an address
  async updateAddress(req, res) {
    try {
      const customerId = parseInt(req.params.customer_id, 10);
      const addressId = parseInt(req.params.id, 10);
      const { full_name, address, city, country, mobile_no } = req.body;
      
      if (isNaN(customerId) || isNaN(addressId)) {
        return res.status(400).json({ message: 'Invalid customer ID or address ID' });
      }
      
      // Security check: Ensure the customer_id from the params matches the authenticated user
      if (customerId !== req.user.customerId) {
        return res.status(403).json({ message: 'Unauthorized: customer_id does not match authenticated user.' });
      }
      
      if (!full_name || !address || !city || !country || !mobile_no) {
        return res.status(400).json({ message: 'All fields are required (full_name, address, city, country, mobile_no)' });
      }
      
      console.log("Updating address ID:", addressId, "for customer ID:", customerId);
      
      // First check if the address belongs to this customer
      const [addressCheck] = await pool.query(
        'SELECT * FROM Delivery_Address WHERE idDelivery_Address = ? AND Customer_idCustomer = ?',
        [addressId, customerId]
      );
      
      if (addressCheck.length === 0) {
        return res.status(404).json({ message: 'Address not found or not authorized to update this address' });
      }
      
      const [result] = await pool.query(
        'UPDATE Delivery_Address SET Full_Name = ?, Address = ?, City = ?, Country = ?, Mobile_No = ? WHERE idDelivery_Address = ? AND Customer_idCustomer = ?',
        [full_name, address, city, country, mobile_no, addressId, customerId]
      );
      
      res.json({ 
        id: addressId, 
        message: 'Address updated successfully' 
      });
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ message: 'Failed to update address', error: error.message });
    }
  }
  
  // Delete an address
  async deleteAddress(req, res) {
    try {
      const customerId = parseInt(req.params.customer_id, 10);
      const addressId = parseInt(req.params.id, 10);
      
      if (isNaN(customerId) || isNaN(addressId)) {
        return res.status(400).json({ message: 'Invalid customer ID or address ID' });
      }
      
      // Security check: Ensure the customer_id from the params matches the authenticated user
      if (customerId !== req.user.customerId) {
        return res.status(403).json({ message: 'Unauthorized: customer_id does not match authenticated user.' });
      }
      
      console.log("Deleting address ID:", addressId, "for customer ID:", customerId);
      
      // First check if the address belongs to this customer
      const [addressCheck] = await pool.query(
        'SELECT * FROM Delivery_Address WHERE idDelivery_Address = ? AND Customer_idCustomer = ?',
        [addressId, customerId]
      );
      
      if (addressCheck.length === 0) {
        return res.status(404).json({ message: 'Address not found or not authorized to delete this address' });
      }
      
      // Check if there are any orders using this address
      const [orderCheck] = await pool.query(
        'SELECT COUNT(*) as count FROM `Order` WHERE Delivery_Address_idDelivery_Address = ?',
        [addressId]
      );
      
      if (orderCheck[0].count > 0) {
        return res.status(400).json({ message: 'Cannot delete address because it is used by existing orders' });
      }
      
      const [result] = await pool.query(
        'DELETE FROM Delivery_Address WHERE idDelivery_Address = ? AND Customer_idCustomer = ?',
        [addressId, customerId]
      );
      
      res.json({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ message: 'Failed to delete address', error: error.message });
    }
  }
  
  // Get a single address by ID
  async getAddressById(req, res) {
    try {
      const customerId = parseInt(req.params.customer_id, 10);
      const addressId = parseInt(req.params.id, 10);
      
      if (isNaN(customerId) || isNaN(addressId)) {
        return res.status(400).json({ message: 'Invalid customer ID or address ID' });
      }
      
      // Security check: Ensure the customer_id from the params matches the authenticated user
      if (customerId !== req.user.customerId) {
        return res.status(403).json({ message: 'Unauthorized: customer_id does not match authenticated user.' });
      }
      
      console.log("Getting address ID:", addressId, "for customer ID:", customerId);
      
      const [addresses] = await pool.query(
        'SELECT * FROM Delivery_Address WHERE idDelivery_Address = ? AND Customer_idCustomer = ?',
        [addressId, customerId]
      );
      
      if (addresses.length === 0) {
        return res.status(404).json({ message: 'Address not found or not authorized to view this address' });
      }
      
      res.json(addresses[0]);
    } catch (error) {
      console.error("Error fetching address:", error);
      res.status(500).json({ message: 'Failed to fetch address', error: error.message });
    }
  }
}

module.exports = new AddressController(); 