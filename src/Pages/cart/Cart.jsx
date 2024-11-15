import React, { useContext, useEffect, useState } from 'react';
import assets from '../../assets';
import Title from '../../Component/Title';
import CartTotal from './CartTotal';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct } from '../../slices/cartslice';

const Cart = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.cart);  
  const [cartData, setCartData] = useState([]);
  const [cartItem,setcartItem] = useState([])
  const currency  = '₹'
  useEffect(() => {
    console.log(products)
    if (products.length > 0) {
      const tempData = products.map((product) => ({
        _id: product.id, 
        name: product.title,
        size: 'default', 
        quantity: product.quantity,
        images:product.images,
        price:product.price
      }));
      setCartData(tempData);
    }
  }, [products]);

  const subtotal = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);

 const handleDelete = (productId) => {
    // dispatch(removeProduct(productId)); 
  };

  return (
    <div className=" border-t pt-14 mx-16">
      <div className=" text-3xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const proudctData = products.find(
            (product) => product.id === item._id
          );

          return (
            <div
              key={index}
              className=" py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 "
            >
              <div className=" flex items-start gap-6">
                <img
                  className=" w-16 sm:w-20 "
                  src={proudctData.images[0].url}
                  alt=""
                />
                <div>
                  <p className=" text-xs s.:text-lg font-medium">
                    {proudctData.title}
                  </p>
                  <div className=" flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {proudctData.price}
                    </p>
                
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => handleDelete(item._id)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.Bin}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className=" flex justify-end my-20">
        <div className=" w-full sm:w-[450px]">
          <CartTotal subtotal={subtotal}/>
          <div className=" w-full text-end">
            <button
              onClick={() => navigate('/place-order')}
              className=" bg-black text-white text-sm my-8 px-3 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;