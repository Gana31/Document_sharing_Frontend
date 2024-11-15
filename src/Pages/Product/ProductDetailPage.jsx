import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetProductId } from '../../Services/operations/productoperiton';
import { useParams } from 'react-router-dom';
import { addToCart } from '../../Services/operations/cartopertion';

function ProductDetailPage() {
  const id  = useParams(); 
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageKey, setImageKey] = useState(0); 
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await dispatch(GetProductId(id)); 
      if (data) {
        console.log(data)
        setProduct(data.data); 
        setSelectedImage(data.data?.images[0]?.url); 
      }
    };

    fetchProduct();
  }, [ dispatch]); 

  if (!product) {
    return <div className="p-8 text-center">Loading...</div>; 
  }

  const handleImageChange = (image) => {
    // console.log(image)
    setImageKey(image.id); 
    setSelectedImage(image.url); 
  };
  const handleOrderNow  = () => {
    if (product) {
      dispatch(addToCart(product, quantity)); // Dispatch action to add product to cart
    }
  };
  return (
    <div className="font-sans p-8 mt-10 lg:max-w-6xl max-w-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product images */}
        <div className="text-center">
          <div className="lg:h-[560px] overflow-hidden">
            <img
              key={imageKey} // Ensure animation triggers when image changes
              src={selectedImage} // Use the selected image here
              alt={product.title}
              className="lg:w-11/12 w-full h-full rounded-md object-contain object-center transition-opacity duration-500 ease-in-out opacity-100"
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {product?.images?.map((image, index) => (
              <img
                key={index}
                src={image.url}  // Ensure `image.url` is used here
                alt={`Product Image ${index + 1}`}
                className="w-16 cursor-pointer rounded-md hover:opacity-75"
                onClick={() => handleImageChange(image)} // Update selected image on click
              />
            ))}
          </div>
        </div>

        {/* Product details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>
          <p className="text-sm text-gray-500 mt-2">by {product.author}</p>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-3xl font-bold text-gray-800">₹{product.price}</span>
            <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <strong>{product.stock}</strong> copies available.
            </p>
            <p className="text-sm text-gray-600 mt-2">Tax included</p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4">
            <label htmlFor="quantity" className="text-xl font-semibold text-gray-800">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              defaultValue="1"
              className="mt-2 p-2 border rounded-md w-20"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              type="button"
              className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-md"
              onClick={handleOrderNow}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="min-w-[200px] px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-md"
              onClick={handleOrderNow}
            >
              Order Now
            </button>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mt-8">
            <span className="text-pink-500 font-semibold">{product.rating}</span>
            <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
          </div>

          {/* Product Description */}
          <hr className="my-8" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Description</h3>
            <p className="text-sm text-gray-600 mt-4">{product.description}</p>
          </div>

          {/* Features */}
          <hr className="my-8" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Features</h3>
            <ul className="list-disc ml-8 mt-4 text-sm text-gray-600">
              <li>Intriguing story full of twists and turns.</li>
              <li>Perfect for fans of science fiction and adventure.</li>
              <li>Engaging and thought-provoking narrative.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800">Customer Reviews</h3>
        {product?.reviewDetails?.length === 0 ? (
          <p className="text-sm text-gray-600 mt-4">No reviews yet.</p>
        ) : (
          product?.reviewDetails?.map((review, index) => (
            <div key={index} className="mt-4 p-4 border rounded-md shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{review.name}</span>
                <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
