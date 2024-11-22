import React, { useEffect, useState, useMemo } from 'react';
import ProductItem from './ProductItem';
import Title from '../../Component/Title';
import { useDispatch, useSelector } from 'react-redux';
import { GetALLProduct } from '../../Services/operations/productoperiton';

const ProductList = () => {
  const { product, categories } = useSelector((state) => state.product); 
  const [showModal, setShowModal] = useState(null); 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(GetALLProduct());
  }, [dispatch]);


  const filteredProducts = useMemo(() => {
    let filtered = [...product];
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        item.categories.some((cat) => selectedCategories.includes(cat.name))
      );
    }


    if (sortType === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [product, selectedCategories, sortType]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const closeModal = () => setShowModal(null);

  return (
    <div className="flex flex-col lg:pt-10 pt-4 border-t m-2 relative">
      {/* Header Section */}
      <div className="flex lg:justify-between justify-center text-base sm:text-2xl sm:mb-2 lg:mb-4 lg:px-4">
        <Title text1="ALL" text2="COLLECTIONS" />

        {/* Sort Dropdown (Visible in Desktop View Only) */}
        <select
          onChange={(e) => setSortType(e.target.value)}
          className="border-2 border-gray-300 text-sm px-2 sm:block hidden"
        >
          <option value="relevant">Sort by: Recommended</option>
          <option value="low-high">Sort by: Low To High</option>
          <option value="high-low">Sort by: High To Low</option>
        </select>
      </div>

      <div className="flex">
        {/* Left-side Filter Section */}
        <div className="hidden sm:block w-1/4 mr-5">
          <div className="border border-gray-300 p-4">
            <h3 className="text-lg font-semibold mb-4">CATEGORIES</h3>
            <div className="flex flex-col gap-2 text-sm">
              {categories.map((cat, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={cat.name} // Make sure value is the category name
                    onChange={toggleCategory}
                    className="w-4 h-4"
                  />
                  {cat.name} {/* Display category name */}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-2 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-lg font-semibold text-gray-500">
              No products found matching your selection.
            </div>
          ) : (
            filteredProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.title}
                id={item.id}
                price={item.price}
                image={item.images}
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile View Buttons */}
      <div
        className="fixed left-0 right-0 bg-white shadow-lg sm:hidden border-t border-gray-300"
        style={{ bottom: 'calc(env(safe-area-inset-bottom))' }}
      >
        <div className="flex justify-around text-center items-center">
          <button
            className="w-full text-black py-2 px-4 border-r border-gray-300"
            onClick={() => setShowModal('filter')}
          >
            Filter
          </button>
          <button
            className="w-full text-black py-2 px-4"
            onClick={() => setShowModal('categories')}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full h-full sm:h-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {showModal === 'filter' ? 'Sort By' : 'Categories'}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            {showModal === 'categories' && (
              <div>
                <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                  {categories.map((cat, index) => (
                    <p className="flex gap-2" key={index}>
                      <input
                        className="w-3"
                        type="checkbox"
                        value={cat.name}
                        onChange={(e) => toggleCategory(e)}
                        checked={selectedCategories.includes(cat.name)} // Check if the category is selected
                      />
                      {cat.name} 
                    </p>
                  ))}
                </div>
              </div>
            )}
            {showModal === 'filter' && (
              <div className="flex flex-col gap-4">
                <button
                  className="py-2 px-4 text-left border-b border-gray-300"
                  onClick={() => {
                    setSortType('low-high');
                    closeModal();
                  }}
                >
                  Low to High
                </button>
                <button
                  className="py-2 px-4 text-left border-b border-gray-300"
                  onClick={() => {
                    setSortType('high-low');
                    closeModal();
                  }}
                >
                  High to Low
                </button>
                <button
                  className="py-2 px-4 text-left"
                  onClick={() => {
                    setSortType('relevant');
                    closeModal();
                  }}
                >
                  Relevant
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
