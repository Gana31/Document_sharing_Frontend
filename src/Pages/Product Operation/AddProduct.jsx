import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADDPRODUCT, GET_CATEGORIES, UPDATE_PRODUCT } from '../../data/constant';
import assets from '../../assets';
import apiClient from '../../Services/ApiConnect';
import LoadingSpinner from '../../Component/Common/LoadingSpinner';

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.product || null;

  // State for input values
  const [title, setTitle] = useState(productToEdit?.title || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState(productToEdit?.price || '');
  const [stock, setStock] = useState(productToEdit?.stock || '');
  const [images, setImages] = useState(productToEdit?.images || []);
  const [accessMode, setAccessMode] = useState(productToEdit?.access_mode || 'offline');
  const [documentFile, setDocumentFile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(productToEdit?.categories.map(cat => cat.id) || []);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    images: '',
    categories: '',
    documentFile: '',
  });

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

    if (productToEdit) {
      setImages(productToEdit.images || []);
      if (productToEdit.access_mode === 'online' && productToEdit.pdfs?.length > 0) {
        setDocumentFile(productToEdit.pdfs[0]);
      }
    }
  }, [productToEdit]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Please enter a title.';
    if (!description) newErrors.description = 'Please enter a description.';
    if (!price) newErrors.price = 'Please enter a price.';
    if (!stock && accessMode === 'offline') newErrors.stock = 'Please enter a stock quantity.';
    if (images.length === 0 || !images.some((img) => img instanceof File || img.url)) {
      newErrors.images = 'Please upload at least one image.';
    }
    if (selectedCategories.length === 0) newErrors.categories = 'Please select at least one category.';
    if (accessMode === 'online' && !documentFile) {
      newErrors.documentFile = 'Please upload a PDF or Word document for online products.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.filter(
      (file) => !images.some((image) => image instanceof File && image.name === file.name)
    );
    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      setDocumentFile(file);
      setErrors((prev) => ({ ...prev, documentFile: '' }));
    } else {
      setDocumentFile(null);
      e.target.value = '';
      setErrors((prev) => ({ ...prev, documentFile: 'Only PDF or Word files are allowed.' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', accessMode === 'offline' ? stock : 0);
    formData.append('access_mode', accessMode);
    formData.append('createdBy', user.id);

    selectedCategories.forEach((cat) => formData.append('categories[]', cat));

    images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      } else if (image.url) {
        formData.append('oldImages[]', JSON.stringify(image));
      }
    });

    if (accessMode === 'online' && documentFile) {
      if (documentFile instanceof File) {
        formData.append('document', documentFile);
      } else {
        formData.append('document', JSON.stringify(documentFile));
      }
    }

    try {
     
      const url = productToEdit ? `${UPDATE_PRODUCT}/${productToEdit.id}` : ADDPRODUCT;
      const response = productToEdit
        ? await apiClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list-product');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3">
      {/* Access Mode Selection */}
      <div>
        <p className="mb-2">Access Mode</p>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="access_mode"
              value="offline"
              checked={accessMode === 'offline'}
              onChange={(e) => setAccessMode(e.target.value)}
            />{' '}
            Offline
          </label>
          <label>
            <input
              type="radio"
              name="access_mode"
              value="online"
              checked={accessMode === 'online'}
              onChange={(e) => setAccessMode(e.target.value)}
            />{' '}
            Online
          </label>
        </div>
      </div>

      {/* Document Upload for Online Mode */}
      {accessMode === 'online' && (
  <div className='flex gap-x-5 items-center'>
   
    <input type="file" onChange={handleDocumentUpload} className='h-7' />
    {errors.documentFile && <p className="text-red-500 text-sm">{errors.documentFile}</p>}

    {documentFile && !(documentFile instanceof File) && (
      <div className=" flex mb-2">
       <div className='  mr-5'>
       <p className="text-sm ">Existing Document:</p>
        <a 
          href={documentFile.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 underline"
        >
          {documentFile.name || 'View Document'}
        </a>
       </div>
        <button
          type="button"
          className="ml-2 px-3 py-1 text-white bg-red-500 rounded"
          onClick={() => setDocumentFile(null)} // Allow removing the document
        >
          Remove
        </button>
      </div>
    )}
  </div>
)}


      {/* Image Upload */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2 flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <img
                className="w-full h-full object-cover"
                src={image instanceof File  ? URL.createObjectURL(image) : image.url || image}
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
            <input type="file" id="imageUpload" hidden multiple onChange={handleImageUpload} />
          </label>
        </div>
        {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
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
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="w-full">
        <p className="mb-2">Description</p>
        <textarea
          className="w-full h-56 px-3 py-2"
          placeholder="Write Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
        {accessMode === 'offline' && (
          <div className="flex-1">
            <p className="mb-2">Stock</p>
            <input
              className="w-full px-3 py-2"
              type="number"
              placeholder="Enter Stock Quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
          </div>
        )}

      </div>

      {/* Categories */}
      <div>
        <p className="mb-2">Categories</p>
        {loadingCategories ? (
          <div><LoadingSpinner /></div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`${selectedCategories.includes(cat.id)
                  ? 'bg-pink-300'
                  : 'bg-slate-200'
                  } px-3 py-1 cursor-pointer`}
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}
        {errors.categories && <p className="text-red-500 text-sm">{errors.categories}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-36 max-h-16 py-3 mt-4 bg-black text-white"
      >
        {submitting ? (
          <LoadingSpinner size="w-5 h-5" color="white" />
        ) : (
          productToEdit ? 'Update Product' : 'Add Product'
        )}
      </button>
    </form>
  );
};

export default AddProduct;
