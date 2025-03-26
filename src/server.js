const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/admin/user.routes');
const customerRoutes = require('./routes/admin/customer.routes'); // Import customer routes

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes); // Use the customer routes

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
