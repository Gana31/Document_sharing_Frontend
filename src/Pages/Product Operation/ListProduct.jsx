import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../Services/ApiConnect';
import { DELETE_PRODUCT } from '../../data/constant';
import { useDispatch, useSelector } from 'react-redux';
import { SetUserProudct } from '../../Services/operations/productoperiton';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../Component/Common/LoadingSpinner';
import { setLoading } from '../../slices/authslice';

const ListProduct = ({ token }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const { userProducts } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const currency = '₹';
  const maxNameLength = 20;
  const navigate = useNavigate();


  const [loadingProduct, setLoadingProduct] = useState(null);

  useEffect(() => {
    dispatch(SetUserProudct(user.id));
  }, [dispatch, user]);

  const removeProduct = async (_id) => {
    setLoadingProduct(_id); 
    try {
      const response = await apiClient.delete(`${DELETE_PRODUCT}/${_id}`);
      if (response.data.success) {
       await dispatch(SetUserProudct(user.id));
        toast.success(response.data.message);
        setLoadingProduct(null); 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error while deleting the product');
    } finally {
      setLoadingProduct(null); 
    }
  };

  const editProduct = async (product) => {
    navigate('/add-product', { state: { product } });
  };

  
  const getRandomColor = () => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <p className="mb-4 text-lg font-semibold">All Products List</p>
      <div className="flex flex-col gap-4">

        <div className="hidden md:grid grid-cols-5 items-center py-2 px-4 border-b-2 bg-gray-100 text-sm font-semibold text-gray-700">
          <span className="text-center">Image</span>
          <span className="text-center">Name</span>
          <span className="text-center">Category</span>
          <span className="text-center">Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product list */}
        {userProducts.map((item, index) => {
          const trimmedName =
            item.title.length > maxNameLength
              ? item.title.slice(0, maxNameLength) + '...'
              : item.title;

          return (
            <div
              className={`flex flex-col md:grid md:grid-cols-5 items-center gap-2 p-4 border text-sm text-gray-700 ${loadingProduct === item.id ? 'relative h-32' : ''}`} // Added height constraint for product row
              key={index}
            >
              {/* Show spinner if the product is being deleted */}
              {loadingProduct === item.id ? (
                <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-white">
                  <LoadingSpinner size="w-8 h-8" />
                </div>
              ) : (
                <>
                  {/* Image */}
                  <div className="flex justify-center">
                    <img
                      className="w-16 h-16 object-cover rounded-md"
                      src={item?.images[0]?.url}
                      alt={item.title}
                    />
                  </div>

                  {/* Name */}
                  <p
                    className="text-center font-medium truncate"
                    title={item.title} // Show full title on hover
                  >
                    {trimmedName}
                  </p>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {item.categories.slice(0, 3).map((category, catIndex) => (
                      <span
                        key={catIndex}
                        className={`text-white text-xs px-2 py-1 rounded-full ${getRandomColor()}`}
                      >
                        {category.name}
                      </span>
                    ))}
                    {item.categories.length > 3 && (
                      <span className="text-gray-500 text-xs px-2 py-1 rounded-full bg-gray-200">
                        ...
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <p className="text-center">
                    {currency}
                    {item.price}
                  </p>

                  {/* Action */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => editProduct(item)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(item.id)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Global loading spinner when 'loading' in auth state is true */}
        {loading && (
          <div className="flex justify-center items-center w-full py-4">
            <LoadingSpinner size="w-12 h-12" />
          </div>
        )}
      </div>
    </>
  );
};

export default ListProduct;
