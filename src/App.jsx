import React from 'react';
import Header from './Component/Common/Header';
import LoginPage from './Pages/Auth/LoginPage';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProductDetailPage from './Pages/Product/ProductDetailPage';
import Contact from './Pages/Contactus/ContactUs';
import { useSelector } from 'react-redux';
import Home from './Pages/Home/Home';
import ProductList from './Pages/Product/ProductListPage';
import Cart from './Pages/cart/Cart';
import About from './Pages/About/About';
import AddProduct from './Pages/Product Operation/AddProduct';
import Layout from './Pages/Product Operation/Layout';
import ListProduct from './Pages/Product Operation/ListProduct';
import ManageCategories from './Pages/Categories/ManageCategories';
import Profile from './Pages/Auth/Profile';
import ProtectedRoute from './Component/Common/ProtectedRoute';
import { OrderHistory } from './Pages/Orders/OrderHistory';


function App() {
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();

  const showSidebar = ["/add-product", "/productlist"].includes(location.pathname);

  return (
    <div>
      <Header />
      <Routes>
        <Route 
          path="/login" 
          element={accessToken ? <Navigate to="/productlist" /> : <LoginPage />} 
        />
        <Route path="/" element={<Home />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/productlist/productPage/:product" element={<ProductDetailPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route 
          path="/userorders" 
          element={<ProtectedRoute element={<OrderHistory />} />} 
        />
        <Route 
          path="/add-product"  
          element={<ProtectedRoute element={<Layout><AddProduct /></Layout>} />} 
        />
        <Route 
          path="/list-product"  
          element={<ProtectedRoute element={<Layout><ListProduct /></Layout>} />} 
        />
        <Route 
          path="/manage-category"  
          element={<ProtectedRoute element={<Layout><ManageCategories /></Layout>} />} 
        />
      </Routes>
    </div>
  );
}

export default App;
