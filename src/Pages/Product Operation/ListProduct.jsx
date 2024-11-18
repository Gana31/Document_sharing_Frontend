
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../Services/ApiConnect';
import { GET_USER_PRODUCT } from '../../data/constant';
import { useSelector } from 'react-redux';

const ListProduct = ({ token }) => {
  const [list, setList] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const currency = '₹';
  const fetchList = async () => {
    try {
        if (user) {
            const response = await apiClient.get(`${GET_USER_PRODUCT}/${user.id}`);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        }
      
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <p className="mb-4 text-lg font-semibold">All Products List</p>
      <div className="flex flex-col gap-4">
        {/* Table header for larger screens */}
        <div className="hidden md:grid grid-cols-5 items-center py-2 px-4 border-b-2 bg-gray-100 text-sm font-semibold text-gray-700">
          <span className="text-center">Image</span>
          <span className="text-center">Name</span>
          <span className="text-center">Category</span>
          <span className="text-center">Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product list */}
        {list.map((item, index) => (
          <div
            className="flex flex-col md:grid md:grid-cols-5 items-center gap-2 p-4 border text-sm text-gray-700"
            key={index}
          >
            {/* Image */}
            <div className="flex justify-center">
              <img className="w-16 h-16 object-cover rounded-md" src={item.images[0].url} alt={item.title} />
            </div>

            {/* Name */}
            <p className="text-center font-medium truncate">{item.title}</p>

            {/* Category */}
            <p className="text-center">{item.categories[0].name}</p>

            {/* Price */}
            <p className="text-center">
              {currency}
              {item.price}
            </p>

            {/* Action */}
            <div className='flex gap-x-3'>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-center text-red-600 hover:text-red-800 cursor-pointer"
            >
              edit 
            </button>
            <span>|</span>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-center text-red-600 hover:text-red-800 cursor-pointer"
            >
              Remove
            </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProduct;