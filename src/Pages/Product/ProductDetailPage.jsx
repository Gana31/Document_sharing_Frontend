import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProductId } from '../../Services/operations/productoperiton';
import { useParams } from 'react-router-dom';
import { addToCart } from '../../Services/operations/cartopertion';
import LoadingSpinner from '../../Component/Common/LoadingSpinner';
import { toast } from 'react-toastify';

function ProductDetailPage() {
  const id = useParams(); // Extract product ID from the route params
  const dispatch = useDispatch();
  const {loading } = useSelector((state) => state.auth); 
  const { singleProduct } = useSelector((state) => state.product); // Get the single product from Redux
  const [selectedImage, setSelectedImage] = useState("");
  const [imageKey, setImageKey] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(GetProductId(id)); 

  }, [dispatch]);

  useEffect(() => {
    if (singleProduct?.images?.length > 0) {
      setSelectedImage(singleProduct.images[0].url);
    }
  }, [singleProduct]);


  const handleImageChange = (image) => {
    setImageKey(image.id);
    setSelectedImage(image.url);
  };

  const handleOrderNow = () => {
    if (singleProduct && quantity > 0) {
      if (quantity <= singleProduct.stock) {
        dispatch(addToCart(singleProduct, quantity)); // Dispatch action to add product to cart
      } else {
        toast.error(`Cannot add more than ${singleProduct.stock} copies.`);
      }
    }else{
      toast.error(`Atleast add 1 copies.`);
    }
    
  };
  if(loading){
    return ( <div className='w-[100vw] h-[100vh]'>
      <LoadingSpinner/>
    </div>)
  }


  return (
    <div className="font-sans lg:p-8 p-3 mt-10 lg:max-w-6xl max-w-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product images */}
        <div className="text-center">
          <div className="lg:h-[560px] overflow-hidden">
            <img
              key={imageKey}
              src={selectedImage}
              alt={singleProduct.title}
              className="lg:w-11/12 w-full h-full rounded-md object-contain object-center transition-opacity duration-500 ease-in-out opacity-100"
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {singleProduct?.images?.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Product Image ${index + 1}`}
                className="w-16 cursor-pointer rounded-md hover:opacity-75"
                onClick={() => handleImageChange(image)}
              />
            ))}
          </div>
        </div>

        {/* Product details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{singleProduct.title}</h2>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-3xl font-bold text-gray-800">₹{singleProduct.price}</span>
            {singleProduct.originalPrice && (
              <span className="text-lg text-gray-500 line-through">₹{singleProduct.originalPrice}</span>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <strong>{singleProduct.stock}</strong> copies available.
            </p>
            <p className="text-sm text-gray-600 mt-2">Tax included</p>
          </div>

          {/* Quantity Selector */}
          <div className="sm:w-full mt-4 sm:items-center sm:text-center lg:text-start">
            <label htmlFor="quantity" className="text-xl font-semibold text-gray-800 mr-2">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={singleProduct.stock}
              defaultValue="1"
              className="mt-2 p-2 border rounded-md w-20"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="sm:w-full flex flex-col lg:flex-row gap-4 lg:mt-8 mt-4 text-center items-center justify-center lg:justify-normal">
            <button
              type="button"
              className="lg:min-w-[200px] w-full px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-md"
              onClick={handleOrderNow}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="lg:min-w-[200px] w-full  px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-md"
              onClick={handleOrderNow}
            >
              Order Now
            </button>
          </div>

          {/* Rating & Reviews */}
         
          {/* Product Description */}
          <hr className="my-8" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Description</h3>
            <p className="text-sm text-gray-600 mt-4">{singleProduct.description}</p>
          </div>

          {/* Features */}
          {/* <hr className="my-8" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Features</h3>
            <ul className="list-disc ml-8 mt-4 text-sm text-gray-600">
              <li>Intriguing story full of twists and turns.</li>
              <li>Perfect for fans of science fiction and adventure.</li>
              <li>Engaging and thought-provoking narrative.</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
