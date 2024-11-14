import React from 'react'
import Header from './Component/Common/Header'
import LoginPage from './Pages/Auth/LoginPage'
import { Navigate, Route, Routes} from 'react-router-dom'
import ProductDetailPage from './Pages/Product/ProductDetailPage'
import Contact from './Pages/Contactus/ContactUs'
import { useSelector } from 'react-redux'
import Home from './Pages/Home/Home'
import ProductList from './Pages/Product/ProductListPage'
import Cart from './Pages/cart/Cart'
import About from './Pages/About/About'

function App() {
  const { accessToken } = useSelector((state) => state.auth);
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
       
       </Routes>
    </div>
  )
}

export default App