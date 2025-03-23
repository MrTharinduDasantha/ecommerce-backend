import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Ensure react-router-dom is installed
import OrderManagement from './components/OrderManagement';
import UserManagement from './components/UserManagement';
import Notifications from './components/Notifications';
import CustomerManagement from './components/CustomerManagement';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
  
      <BrowserRouter>
        <Routes>
        <Route path="/ordre-management" element={<OrderManagement/>} />
        <Route path="/user-management" element={<UserManagement/>} />
        <Route path="/notifications" element={<Notifications/>} />
        <Route path="/customer-management" element={<CustomerManagement/>} />
        </Routes>
       <Footer/>
      </BrowserRouter>
  
    </div>
  );
} 

export default App;