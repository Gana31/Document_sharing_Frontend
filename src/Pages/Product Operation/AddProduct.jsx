import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADDPRODUCT, GET_CATEGORIES, UPDATE_PRODUCT } from '../../data/constant';
import assets from '../../assets';
import apiClient from '../../Services/ApiConnect';

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.product || null;

  const [title, setTitle] = useState(productToEdit?.title || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState(productToEdit?.price || '');
  const [stock, setStock] = useState(productToEdit?.stock || '');
  const [images, setImages] = useState(productToEdit?.images || []); // Keep old images
  const [selectedCategories, setSelectedCategories] = useState(productToEdit?.categories.map(cat => cat.id) || []);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(GET_CATEGORIES);
        setCategories(response.data.data || []);
        setLoadingCategories(false);
      } catch (error) {
        toast.error('Failed to fetch categories');
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]); // Add new images to the existing ones
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index)); // Remove image from the list
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    selectedCategories.forEach((cat) => formData.append('categories', cat));

    // Prepare images: new images (file instances) and old images (with ids)
    const newImages = [];
    const oldImages = [];
    
    images.forEach((image) => {
      if (image instanceof File) {
        newImages.push(image);
      } else {
        oldImages.push(image); // Old image URLs with ids
      }
    });

    // Append new images
    newImages.forEach((image) => {
      formData.append('images', image);
    });

    // Append old images with their ids
    oldImages.forEach((image) => {
      formData.append('images', JSON.stringify({ id: image.id, url: image.url }));
    });

    const url = productToEdit ? `${UPDATE_PRODUCT}/${productToEdit.id}` : ADDPRODUCT;
    const method = productToEdit ? 'put' : 'post';

    try {
      const response = await apiClient({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list-product');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to submit product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3">
      {/* Image upload */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2 flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <img
                className="w-full h-full object-cover"
                src={image instanceof File ? URL.createObjectURL(image) : image.url || image}
                alt={`Preview ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-sm"
              >
                x
              </button>
            </div>
          ))}
          <label htmlFor="imageUpload">
            <img className="w-20 cursor-pointer" src={assets.uploadArea} alt="Upload" />
            <input
              type="file"
              id="imageUpload"
              hidden
              multiple
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      {/* Title, Description, Price, Stock */}
      <div className="w-full">
        <p className="mb-2">Title</p>
        <input
          className="w-full px-3 py-2"
          type="text"
          placeholder="Type Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Description</p>
        <textarea
          className="w-full h-56 px-3 py-2"
          placeholder="Write Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="w-full flex gap-4">
        <div className="flex-1">
          <p className="mb-2">Price</p>
          <input
            className="w-full px-3 py-2"
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <p className="mb-2">Stock</p>
          <input
            className="w-full px-3 py-2"
            type="number"
            placeholder="Enter Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Categories</p>
        {loadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`${
                  selectedCategories.includes(cat.id)
                    ? 'bg-pink-300'
                    : 'bg-slate-200'
                } px-3 py-1 cursor-pointer`}
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="w-36 py-3 mt-4 bg-black text-white">
        {productToEdit ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProduct;
