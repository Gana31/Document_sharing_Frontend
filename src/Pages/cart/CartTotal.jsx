import React from 'react';
import Title from '../../Component/Title';

const CartTotal = ({ subtotal }) => {
  const currency = '₹';


  const shippingFee = Math.max(subtotal * 0.1, 200); 
  const total = subtotal + shippingFee; 

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{currency} {subtotal.toFixed(2)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{currency} {shippingFee.toFixed(2)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>{currency} {total.toFixed(2)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
