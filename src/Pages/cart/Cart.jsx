import React, { useContext, useEffect, useState } from 'react';
import assets from '../../assets';
import Title from '../../Component/Title';
import CartTotal from './CartTotal';

const Cart = () => {
    const [products,setproducts] = useState([]);

  const [cartData, setCartData] = useState([]);
    const [cartItem,setcartItem] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItem[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItem, products]);

  return (
    <div className=" border-t pt-14 mx-16">
      <div className=" text-3xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const proudctData = products.find(
            (product) => product._id === item._id
          );

          return (
            <div
              key={index}
              className=" py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 "
            >
              <div className=" flex items-start gap-6">
                <img
                  className=" w-16 sm:w-20 "
                  src={proudctData.image[0]}
                  alt=""
                />
                <div>
                  <p className=" text-xs s.:text-lg font-medium">
                    {proudctData.name}
                  </p>
                  <div className=" flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {proudctData.price}
                    </p>
                    <p className=" px-2 sm:px-3 sm:py-1 border bg-slate-50 ">
                      {item.size}
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
                onClick={() => updateQuantity(item._id, item.size, 0)}
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
          <CartTotal/>
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