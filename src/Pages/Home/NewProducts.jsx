import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../Component/Title';
import ProductItem from '../Product/ProductItem';
import { GetALLProduct } from '../../Services/operations/productoperiton';
import LoadingSpinner from '../../Component/Common/LoadingSpinner';

const NewProducts = () => {
  const { loading } = useSelector((state) => state.auth);  
  const { product } = useSelector((state) => state.product);  
  const dispatch = useDispatch();

  const [allProducts, setAllProducts] = useState([]);


  useEffect(() => {
    if (!product || product.length === 0) {  
      dispatch(GetALLProduct());
    }
  }, [dispatch, product]);


  useEffect(() => {
    if (product && product.length > 0) {
      setAllProducts(product.slice(0, 4));
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
        {loading ? (
          <div className="col-span-full text-center text-lg font-semibold text-gray-500">
            <LoadingSpinner/>
          </div>
        ) : (
          allProducts.length > 0 ? (
            allProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item.id}
                name={item.title}
                image={item.images}  
                price={item.price}
                location={"productlist/productPage"}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-lg font-semibold text-gray-500">
              No products found.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NewProducts;
