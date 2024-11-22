import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import apiClient from '../../Services/ApiConnect';
import { USER_PREVIOUS_ORDERS } from '../../data/constant';
import Title from '../../Component/Title';

const UserOrders = () => {
  const { accessToken, user } = useSelector((state) => state.auth);
  const [orderData, setOrderData] = useState([]);
  const currency = '₹';

  // Load order data from the API
  const loadOrderData = async () => {
    try {
      const response = await apiClient.get(`${USER_PREVIOUS_ORDERS}/${user.id}`);
    //   console.log(response);
      
      if (response.data.success) {
        let allOrders = [];
        
        // Loop through the orders
        response.data.data.forEach((order) => {
          let totalAmount = 0; // Variable to track the total price for the order
          let orderItems = []; // Array to hold order items

          // Loop through the items in the order
          order.orderMappings.forEach((item) => {
            // Calculate total price for the order
            totalAmount += item.productordermapping.price * item.quantity;
            
            // Add additional order info to the item
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['orderDate'] = order.orderDate;
            
            // Push this item into the orderItems array
            orderItems.push(item);
          });

          // Push the complete order object with its items and total price
          allOrders.push({
            orderId: order.id,
            totalAmount,
            orderItems,
            orderStatus: order.status,
            orderDate: order.orderDate,
            paymentMethod: order.paymentMethod,
          });
        });

        // Set the order data after processing
        setOrderData(allOrders.reverse()); // Display in reverse order
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Error loading orders. Please try again.');
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadOrderData();
    }
  }, [accessToken]);

  return (
    <div className="border-t p-16">
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      <div>
        {orderData.map((order, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm w-full">
              <div className="flex flex-col gap-y-9 w-full">
                {/* Loop through each item in the order and display them */}
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-6 text-sm mb-4 md:mb-0">
                    {/* Product Image */}
                    <img className="w-16 sm:w-20" src={item.productordermapping.images[0].url} alt="product" />
                    <div>
                      {/* Product Title */}
                      <p className="text-xl font-medium">{item.productordermapping.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-600">
                        {/* Product Price */}
                        <p className="flex items-center">{currency}{item.productordermapping.price}</p>
                        {/* Product Quantity */}
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-full">
                <div className="flex flex-col items-center">
                  <p className="text-xl font-medium">{currency}{order.totalAmount}</p>
                  <p className="text-gray-500 text-sm">Total for this order</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <p className="mt-2">
              Date: <span className="text-gray-400">{new Date(order.orderDate).toDateString()}</span>
            </p>

            {/* Track Order Button */}
            <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm mt-4">
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
