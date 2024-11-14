import React, { useContext } from 'react';
import Title from '../../Component/Title';


const CartTotal = () => {

const currency  = '₹'
  const subtotal = 100 || 0;
  const shippingFee = 400 || 0; 
  const total = subtotal + shippingFee; 


  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {subtotal}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency} {subtotal === 0 ? 0 : shippingFee}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency} {subtotal === 0 ? 0 : total }.00</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;