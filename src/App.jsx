import React from 'react'
import Header from './Component/Common/Header'
import LoginPage from './Pages/Auth/LoginPage'
import { Navigate, Route, Routes, useLocation} from 'react-router-dom'
import ProductDetailPage from './Pages/Product/ProductDetailPage'
import Contact from './Pages/Contactus/ContactUs'
import { useSelector } from 'react-redux'
import Home from './Pages/Home/Home'
import ProductList from './Pages/Product/ProductListPage'
import Cart from './Pages/cart/Cart'
import About from './Pages/About/About'
import AddProduct from './Pages/Product Operation/AddProduct'
import Layout from './Pages/Product Operation/Layout'
import ListProduct from './Pages/Product Operation/ListProduct'

function App() {
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();

  const showSidebar = ["/add-product", "/productlist"].includes(location.pathname);

  return (
    <div>
      <Header/>
       <Routes>
       <Route 
          path="/login" 
          element={accessToken ? <Navigate to="/productlist" /> : <LoginPage />} 
        />
         <Route path="/" element={<Home/>} />
        <Route path="/productlist" element={<ProductList/>} />
        <Route path="/productlist/productPage/:product" element={<ProductDetailPage/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/add-product"  element={ <Layout> <AddProduct /></Layout> } /> 
        <Route path="/list-product"  element={ <Layout> <ListProduct /></Layout> } />
       </Routes>
    </div>
  )
}

export default App