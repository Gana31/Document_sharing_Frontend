import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { ADD_CATEGORY, GET_CATEGORIES, DELETE_CATEGORY, UPDATE_CATEGORY, GET_CATEGORIES_BY_USERID } from '../../data/constant';
import apiClient from '../../Services/ApiConnect';
import { setLoading } from '../../slices/authslice';
import LoadingSpinner from '../../Component/Common/LoadingSpinner';

const ManageCategories = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // State for input values for Add/Edit Category
  const [name, setname] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // State for errors
  const [errors, setErrors] = useState({
    name: '',
    description: '', 
  });

  // State to track edit mode
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${GET_CATEGORIES_BY_USERID}/${user.id}`);
      setCategories(response.data.data || []);
      setLoadingCategories(false);
    } catch (error) {
      toast.error('Failed to fetch categories');
      setLoadingCategories(false);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Please enter a title.';
    if (!description) newErrors.description = 'Please enter a description.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const formData = {
      name,
      description,
      userId: user.id
    };

    try {
      let response;
      if (editMode) {
        // Update category API call
        response = await apiClient.put(`${UPDATE_CATEGORY}/${editCategoryId}`, formData);
      } else {
        // Add category API call
        response = await apiClient.post(ADD_CATEGORY, formData);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setname('');
        setDescription('');
        setEditMode(false);
        setEditCategoryId(null);
        fetchCategories(); // Reload categories
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to submit category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    const formData = {
      userId: user.id
    };
    if (confirmDelete) {
      try {
        const response = await apiClient.delete(`${DELETE_CATEGORY}/${categoryId}`,{
          data: { userId: user.id }, // Pass userId in the data field
        });

        if (response.data.success) {
          toast.success(response.data.message);
          fetchCategories(); // Reload categories after deleting
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleEditCategory = (category) => {
    setname(category.name);
    setDescription(category.description);

    // Set edit mode and category ID
    setEditMode(true);
    setEditCategoryId(category.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Add/Edit Category Section */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">{editMode ? 'Edit Category' : 'Add Category'}</h2>
        <form onSubmit={handleAddOrUpdateCategory} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <p className="mb-2">Category Title</p>
            <input
              className="w-full px-3 py-2"
              type="text"
              placeholder="Enter Category Title"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <p className="mb-2">Category Description</p>
            <textarea
              className="w-full h-24 px-3 py-2"
              placeholder="Enter Category Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-36 max-h-16 py-3 bg-black text-white"
          >
            {submitting ? (
              <LoadingSpinner size="w-5 h-5" color="white" />
            ) : (
              editMode ? 'Update Category' : 'Add Category'
            )}
          </button>
        </form>
      </div>

      {/* Categories List & Delete Section */}
      <div>
        <div className="border-t-2 border-gray-300 my-6"></div> {/* Partition line */}
        <h2 className="text-xl mb-4">Categories List</h2>
        {loadingCategories ? (
          <LoadingSpinner />
        ) : (
          <div>
            {categories.length === 0 ? (
              <p>No categories available.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center p-4 border-b border-gray-300 gap-2">
                    <div className="flex-1">
                      <p className="text-lg">{cat.name}</p>
                      <p className="text-sm text-gray-600">{cat.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="text-green-500 bg-transparent border-2 border-green-500 px-4 py-2 rounded-full hover:bg-green-500 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-500 bg-transparent border-2 border-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
