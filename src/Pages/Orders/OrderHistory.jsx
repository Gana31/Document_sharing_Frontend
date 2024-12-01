import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { PackageX } from 'lucide-react';
import apiClient from '../../Services/ApiConnect';
import { USER_PREVIOUS_ORDERS } from '../../data/constant';
import { OrderCard } from './OrderCard';
import LoadingSpinner from '../../Component/Common/LoadingSpinner';

export function OrderHistory() {
  const { accessToken, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('offline'); // Tabs: online/offline orders

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`${USER_PREVIOUS_ORDERS}/${user.id}`);
      // console.log(response.data.data)
      if (response.data.success) {
        const fetchedOrders = response.data.data || [];
        const formattedOrders = fetchedOrders.map((order) => {
          // Format each order with details
          return {
            orderId: order.id,
            totalAmount: order.totalPrice,
            orderDate: new Date(order.orderDate),
            orderItems: order.orderMappings.map((item) => ({
              pdflink: item.pdflink,
              ...item.productordermapping,
              quantity: item.quantity,
              orderId: order.id,
            })),
          };
        });
        setOrders(formattedOrders.reverse()); // Reverse for latest-first
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Error loading orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load orders on mount or accessToken change
  useEffect(() => {
    if (accessToken) fetchOrders();
  }, [accessToken]);

  // Filter orders based on active tab
  const filteredOrders = orders.map((order) => {
    // console.log(order)
    // Separate products by access_mode
    const onlineProducts = order.orderItems.filter(
      (item) => item.access_mode === 'online'
    );
    const offlineProducts = order.orderItems.filter(
      (item) => item.access_mode === 'offline'
    );

    // If there are products for both modes, split the order into two
    let splitOrders = [];
    if (onlineProducts.length > 0 && offlineProducts.length > 0) {
      splitOrders = [
        { ...order, orderItems: onlineProducts, accessMode: 'online' },
        { ...order, orderItems: offlineProducts, accessMode: 'offline' },
      ];
    } else {
      splitOrders = [{ ...order, orderItems: [...onlineProducts, ...offlineProducts], accessMode: onlineProducts.length > 0 ? 'online' : 'offline' }];
    }

    return splitOrders;
  }).flat(); // Flatten the nested array

  // Filter the orders based on the active tab
  const filteredOrdersByTab = filteredOrders.filter((order) =>
    order.accessMode === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        {/* Tab Buttons */}
        <div className="flex space-x-1 rounded-lg bg-gray-200 p-1 mb-8">
          <button
            className={`flex-1 py-2.5 text-sm font-medium rounded-md ${
              activeTab === 'offline'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('offline')}
          >
            Offline Orders
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-medium rounded-md ${
              activeTab === 'online'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('online')}
          >
            Online Orders
          </button>
        </div>

        {/* Display Orders or Empty State */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner/>
          </div>
        ) : filteredOrdersByTab.length > 0 ? (
          <div className="space-y-6">
            {filteredOrdersByTab.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <PackageX className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-xl text-gray-500">
              No {activeTab} orders found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
