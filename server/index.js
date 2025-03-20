const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  db.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }
    
    const user = results[0];
    
    // In a real app, you would use bcrypt.compare
    // For simplicity, we're just comparing directly
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Get dashboard stats
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const stats = {};
  
  // Get total products
  db.query('SELECT COUNT(*) as total FROM products', (err, results) => {
    if (err) {
      console.error('Error getting product count:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    stats.totalProducts = results[0].total;
    
    // Get total orders
    db.query('SELECT COUNT(*) as total FROM orders', (err, results) => {
      if (err) {
        console.error('Error getting order count:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      stats.totalOrders = results[0].total;
      
      // Get total users
      db.query('SELECT COUNT(*) as total FROM users', (err, results) => {
        if (err) {
          console.error('Error getting user count:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        stats.totalUsers = results[0].total;
        
        // Get total revenue
        db.query('SELECT SUM(total_price) as total FROM orders', (err, results) => {
          if (err) {
            console.error('Error getting revenue:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          
          stats.totalRevenue = results[0].total || 0;
          
          // Get recent orders
          db.query('SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5', (err, results) => {
            if (err) {
              console.error('Error getting recent orders:', err);
              return res.status(500).json({ message: 'Server error' });
            }
            
            stats.recentOrders = results;
            
            res.json(stats);
          });
        });
      });
    });
  });
});

// Products routes
app.get('/api/products', authenticateToken, (req, res) => {
  db.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id', (err, results) => {
    if (err) {
      console.error('Error getting products:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(results);
  });
});

app.post('/api/products', authenticateToken, (req, res) => {
  const { name, description, price, stock, category_id, image_url } = req.body;
  
  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Name, price and stock are required' });
  }
  
  const product = { name, description, price, stock, category_id, image_url };
  
  db.query('INSERT INTO products SET ?', product, (err, result) => {
    if (err) {
      console.error('Error creating product:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.status(201).json({ id: result.insertId, ...product });
  });
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id, image_url } = req.body;
  
  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Name, price and stock are required' });
  }
  
  const product = { name, description, price, stock, category_id, image_url };
  
  db.query('UPDATE products SET ? WHERE id = ?', [product, id], (err) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json({ id, ...product });
  });
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM products WHERE id = ?', id, (err) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  });
});

// Categories routes
app.get('/api/categories', authenticateToken, (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('Error getting categories:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(results);
  });
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  
  db.query('INSERT INTO categories SET ?', { name }, (err, result) => {
    if (err) {
      console.error('Error creating category:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.status(201).json({ id: result.insertId, name });
  });
});

app.put('/api/categories/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  
  db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) {
      console.error('Error updating category:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json({ id, name });
  });
});

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM categories WHERE id = ?', id, (err) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  });
});

// Users routes
app.get('/api/users', authenticateToken, (req, res) => {
  db.query('SELECT id, name, email, role, created_at FROM users', (err, results) => {
    if (err) {
      console.error('Error getting users:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(results);
  });
});

// Orders routes
app.get('/api/orders', authenticateToken, (req, res) => {
  db.query(
    'SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC',
    (err, results) => {
      if (err) {
        console.error('Error getting orders:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.json(results);
    }
  );
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.query(
    'SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error getting order:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const order = results[0];
      
      db.query(
        'SELECT oi.*, p.name as product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [id],
        (err, items) => {
          if (err) {
            console.error('Error getting order items:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          
          order.items = items;
          res.json(order);
        }
      );
    }
  );
});

app.put('/api/orders/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json({ id, status });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});