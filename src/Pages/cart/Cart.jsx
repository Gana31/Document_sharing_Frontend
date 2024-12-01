import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../Component/Title';
import CartTotal from './CartTotal';
import { removeProduct, increaseQuantity, decreaseQuantity } from '../../slices/cartslice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // or use your preferred method for API calls
import assets from '../../assets';
import { ProccedToBuy } from '../../Services/operations/cartopertion';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.cart);
  const { user, accessToken } = useSelector((state) => state.auth);
  const currency = '₹';

  // Calculate subtotal
  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate shipping fee based on your logic
  const shippingFee = subtotal > 1 ? Math.max(subtotal * 0.1, 200) : 0;
  const total = subtotal + shippingFee;

  console.log(products);
  const handleDelete = (productId) => {
    dispatch(removeProduct(productId));
  };

  const handleIncrease = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecrease = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  // Handle Proceed to Checkout and make API call
  const handleCheckout = async () => {
    if (!accessToken) {
      toast.error("You cannot buy Without Login");
      navigate("/login");
    }
    dispatch(ProccedToBuy(user.id, products, total));
  };

  return (
    <div className="lg:w-full border-t pt-14 mx-4 sm:mx-16">
      <div className="text-2xl sm:text-3xl mb-3 text-center sm:text-left">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div className="w-full flex px-5 flex-col lg:flex-row">
        <div className="w-full lg:w-[60%]">
          {products.length === 0 ? (
            <div className="text-center text-xl sm:text-2xl text-gray-600 font-medium py-8">
              <p>Your cart is empty.</p>
              <p className="mt-4 text-gray-800 font-bold">Add products to your cart and start shopping!</p>
              <button 
                onClick={() => navigate('/productlist')} 
                className="mt-4 px-6 py-2 text-white bg-black rounded hover:bg-gray-800 transition"
              >
                Go to Shop
              </button>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex gap-4"
              >
                {/* Left Section: Image */}
                <div className="w-1/3 sm:w-1/6 h-auto flex-shrink-0 min-h-25 max-h-72 max-w-36">
                  <img
                    className="w-full h-full object-cover rounded"
                    src={product.images[0]?.url || 'default-image-url'}
                    alt="Product"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Right Section: Details */}
                <div className="w-4/5 flex flex-col lg:flex-row justify-between lg:justify-evenly lg:items-center">
                  <div className="lg:w-[40%]">
                    <p className="text-sm sm:text-lg font-medium">{product.title}</p>
                    {product.access_mode == "online" && 
                    <p className="text-sm mt-4 text-gray-600">
                     TYPE : <strong>PDF/ WORD</strong> </p>}
                  </div>
                  <div>
                    <p className="text-black font-bold lg:text-3xl sm:text-sm mt-1">
                      {currency}
                      {product.price}
                    </p>
                  
                  </div>

                  {/* Quantity Controls */}
                 {product.access_mode == "offline" && 
                   <div className="flex items-center gap-4 mt-2">
                   <button
                     onClick={() => handleDecrease(product.id)}
                     className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                   >
                     -
                   </button>
                   <span className="text-sm sm:text-lg">{product.quantity}</span>
                   <button
                     onClick={() => handleIncrease(product.id)}
                     className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                   >
                     +
                   </button>
                 </div>
                 }

                  {/* Delete Button */}
                  <div>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="mt-4 text-red-500 flex items-center gap-1"
                    >
                      <img
                        className="w-4 sm:w-5"
                        src={assets.Bin} // Change this to your actual icon
                        alt="Delete"
                      />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-10">
          <div className="w-full sm:w-[450px]">
            <CartTotal subtotal={subtotal} shippingFee={shippingFee} total={total} />
            <div className="w-full text-end">
              <button
                onClick={handleCheckout}
                className="bg-black text-white text-sm my-8 px-3 py-3 rounded hover:bg-gray-800 transition"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
