import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import assets from '../../assets';
import { ADDPRODUCT, GET_CATEGORIES } from '../../data/constant';
import apiClient from '../../Services/ApiConnect';
import { useSelector } from 'react-redux';

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [createdBy,setcreatedBy] = useState('')
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(GET_CATEGORIES);
        // console.log(response)
        setCategories(response.data.data || []);
        setLoadingCategories(false);
        if(user){
            setcreatedBy(user.id)
        }
      } catch (error) {
        toast.error('Failed to fetch categories');
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('createdBy', createdBy);
      selectedCategories.forEach((cat) => formData.append('categories', cat));
      images.forEach((image) => formData.append('images', image));

      const response = await axios.post(ADDPRODUCT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setTitle('');
        setDescription('');
        setImages([]);
        setPrice('');
        setStock('');
        setSelectedCategories([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add product');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2 flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <img
                className="w-full h-full object-cover"
                src={URL.createObjectURL(image)}
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
            <img
              className="w-20 cursor-pointer"
              src={assets.uploadArea}
              alt="Upload"
            />
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

      <div className="w-full">
        <p className="mb-2">Title</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
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
          className="w-full max-w-[500px] px-3 py-2"
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

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default AddProduct;
