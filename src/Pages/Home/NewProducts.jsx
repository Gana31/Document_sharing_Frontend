import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../Component/Title';
import ProductItem from '../Product/ProductItem';
import { GetALLProduct } from '../../Services/operations/productoperiton';

const NewProducts = () => {
  const { product } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [allProducts, setAllProducts] = useState([]);

  // Fetch products when the component mounts
  useEffect(() => {
    dispatch(GetALLProduct());
  }, [dispatch]);

  // After fetching products, update the state
  useEffect(() => {
    if (product && product.length > 0) {
      setAllProducts(product.slice(0, 4));  // Update with the correct number of products if needed
      console.log(allProducts);
    }
  }, [product]);

  return (
    <div className="my-10 items-center flex flex-col justify-center">
      <div className="text-center text-3xl py-8">
        <Title text1={'BEST'} text2={'SELLER'} />
        <p className="w-3/5 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Check out our best-selling items, praised for their quality and style. These customer favorites are top-rated for a reason!
        </p>
      </div>

      {/* Display All Products */}
      <div className="w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
        {allProducts.length > 0 ? (
          allProducts.map((item, index) => {
            // Ensure the image URL exists before trying to render the image
            return (
              <ProductItem
                key={index}
                id={item.id}
                name={item.title}
                image={item.images}  
                price={item.price}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center text-lg font-semibold text-gray-500">
            Loading products...
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProducts;
