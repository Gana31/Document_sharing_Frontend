import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import apiClient from '../../Services/ApiConnect';
import { USER_PREVIOUS_ORDERS } from '../../data/constant';
import Title from '../../Component/Title';
import LoadingSpinner from '../../Component/Common/LoadingSpinner'; // Ensure you have a spinner component

const UserOrders = () => {
  const { accessToken, user } = useSelector((state) => state.auth);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const currency = '₹';

  const loadOrderData = async () => {
    setIsLoading(true); // Show spinner while loading
    try {
      const response = await apiClient.get(`${USER_PREVIOUS_ORDERS}/${user.id}`);
      if (response.data.success) {
        const orders = response?.data?.data || [];
        if (orders.length > 0) {
          let allOrders = [];
          orders.forEach((order) => {
            let totalAmount = 0;
            let orderItems = [];

            order.orderMappings.forEach((item) => {
              totalAmount += item.productordermapping.price * item.quantity;
              item['status'] = order.status;
              item['payment'] = order.payment;
              item['paymentMethod'] = order.paymentMethod;
              item['orderDate'] = order.orderDate;
              orderItems.push(item);
            });

            allOrders.push({
              orderId: order.id,
              totalAmount,
              orderItems,
              orderStatus: order.status,
              orderDate: order.orderDate,
              paymentMethod: order.paymentMethod,
            });
          });

          setOrderData(allOrders.reverse()); // Display latest orders first
        } else {
          setOrderData([]); // No orders
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Error loading orders. Please try again.');
    } finally {
      setIsLoading(false); // Hide spinner after loading
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadOrderData();
    }
  }, [accessToken]);

  return (
    <div className="border-t p-16">
      <div className="text-2xl mb-8">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner /> {/* Display spinner while loading */}
        </div>
      ) : orderData.length > 0 ? (
        <div>
          {orderData.map((order, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 text-sm w-full">
                <div className="flex flex-col gap-y-9 w-full">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-6 text-sm mb-4 md:mb-0">
                      <img className="w-16 sm:w-20" src={item.productordermapping.images[0].url} alt="product" />
                      <div>
                        <p className="text-xl font-medium">{item.productordermapping.title}</p>
                        <div className="flex items-center gap-3 mt-2 text-base text-gray-600">
                          <p className="flex items-center">{currency}{item.productordermapping.price}</p>
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
              <p className="mt-2">
                Date: <span className="text-gray-400">{new Date(order.orderDate).toDateString()}</span>
              </p>
              <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm mt-4">
                Track Order
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-xl text-gray-500">No orders created by you. Start shopping now!</p>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
