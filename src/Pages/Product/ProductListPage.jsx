import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import Title from '../../Component/Title';
import { useDispatch, useSelector } from 'react-redux';
import { GetALLProduct } from '../../Services/operations/productoperiton';

const ProductList = () => {
  const { product } = useSelector((state) => state.product);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const dispatch = useDispatch();

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((sub) => sub !== value) : [...prev, value]
    );
  };

  // Initial API call to load products
  useEffect(() => {
    dispatch(GetALLProduct());
  }, [dispatch]);

  // Apply filters whenever category or subCategory changes
  useEffect(() => {
    const applyFilter = () => {
      let productsCopy = product.slice();

      // Filter by selected categories and subcategories (optional: add filter logic here)
      setFilterProducts(productsCopy);
    };

    applyFilter();
  }, [category, subCategory, product]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t m-5">
      {/* Left-side filter container */}
      <div className="flex flex-col min-w-60">
        {/* FILTERS Toggle */}
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={"assets.dropdown_icon"}
            alt="dropdown_icon"
          />
        </p>

        {/* CATEGORIES Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-4 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Kids Book'}
                onChange={toggleCategory}
              />{' '}
              Kids Book
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Comedy'}
                onChange={toggleCategory}
              />{' '}
              Comedy
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Puzzle'}
                onChange={toggleCategory}
              />{' '}
              Puzzle
            </p>
          </div>
        </div>

        {/* TYPE Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-4 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Classic'}
                onChange={toggleSubCategory}
              />{' '}
              Classic
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Adventure'}
                onChange={toggleSubCategory}
              />
              Adventure
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Horror'}
                onChange={toggleSubCategory}
              />
              Horror
            </p>
          </div>
        </div>
      </div>

      {/* Right-side collections */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />

          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low To High</option>
            <option value="high-low">Sort by: High To Low</option>
          </select>
        </div>
        {/* Map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.title}
              id={item.id}
              price={item.price}
              image={item.images}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
