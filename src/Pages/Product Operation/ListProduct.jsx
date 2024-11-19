
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../Services/ApiConnect';
import { DELETE_PRODUCT, GET_USER_PRODUCT } from '../../data/constant';
import { useDispatch, useSelector } from 'react-redux';
import { SetUserProudct } from '../../Services/operations/productoperiton';

const ListProduct = ({ token }) => {
  const [list, setList] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { userProducts } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const currency = '₹';
  

  useEffect(() => {
    dispatch(SetUserProudct(user.id));
  }, [dispatch, user]);

  const removeProduct = async (_id) => {
    try {
      const response = await apiClient.delete(`${DELETE_PRODUCT}/${_id}`);
      if(response.data.success){
        dispatch(SetUserProudct(user.id));
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message||"error while deleting the proudct");
    }
  };

  const editProduct = async (_id) => {}


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
        {userProducts.map((item, index) => (
          <div
            className="flex flex-col md:grid md:grid-cols-5 items-center gap-2 p-4 border text-sm text-gray-700"
            key={index}
          >
            {/* Image */}
            <div className="flex justify-center">
              <img className="w-16 h-16 object-cover rounded-md" src={item?.images[0]?.url} alt={item.title} />
            </div>

            {/* Name */}
            <p className="text-center font-medium truncate">{item.title}</p>

            {/* Category */}
            <p className="text-center">{item?.categories[0]?.name}</p>

            {/* Price */}
            <p className="text-center">
              {currency}
              {item.price}
            </p>

            {/* Action */}
            <div className='flex gap-x-3'>
            <button
              onClick={() => editProduct(item._id)}
              className="text-center text-red-600 hover:text-red-800 cursor-pointer"
            >
              Edit 
            </button>
            <span>|</span>
            <button
              onClick={() => removeProduct(item.id)}
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