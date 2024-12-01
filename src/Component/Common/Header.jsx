import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import assets from '../../assets';
import { logout } from '../../Services/operations/authoperations';
import { selectCartTotalCount } from '../../slices/cartslice';
import { GET_PRODUCT_BY_NAME } from '../../data/constant';
import apiClient from '../../Services/ApiConnect';
import { updateSearchResults } from '../../slices/productslice';

const Header = () => {
  const [visible, setVisible] = useState(false); // Hamburger menu state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchBoxRef = useRef(null);
  const { accessToken } = useSelector((state) => state.auth);
  const totalCartCount = useSelector(selectCartTotalCount);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      dispatch(updateSearchResults(null));
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient(`${GET_PRODUCT_BY_NAME}?query=${searchQuery}`);
      if (response && response.data.data) {
        dispatch(updateSearchResults(response.data.data));
        setSearchResults(response.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (event) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
      setSearchVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const logoutHandler = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="relative">
      {/* Header Bar */}
      <div className="bg-white shadow z-10">
        <div className="flex items-center justify-between px-5 py-5 font-medium h-16">
          {/* Logo */}
          <Link to="/">
            <p>BOOk</p>
          </Link>

          {/* Navigation Links */}
          <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <NavLink to="/" className="flex flex-col items-center gap-1">
              <p>HOME</p>
            </NavLink>
            <NavLink to="/productlist" className="flex flex-col items-center gap-1">
              <p>COLLECTION</p>
            </NavLink>
            <NavLink to="/about" className="flex flex-col items-center gap-1">
              <p>ABOUT</p>
            </NavLink>
            <NavLink to="/contact" className="flex flex-col items-center gap-1">
              <p>CONTACT</p>
            </NavLink>
          </ul>

          {/* Right-Side Icons */}
          <div className="flex items-center gap-6">
            {location.pathname === '/productlist' && (
              <img
                src={assets.searchIcon}
                alt="search"
                className="w-5 cursor-pointer"
                onClick={() => setSearchVisible((prev) => !prev)}
              />
            )}

            <div className="relative">
              <img
                onClick={() => {
                  if (!accessToken) navigate('/login');
                  else toggleDropdown();
                }}
                src={assets.profileIcon}
                alt="Profile"
                className="w-5 cursor-pointer"
              />
              {dropdownVisible && accessToken && (
                <div
                  className="absolute right-0 mt-2 py-2 w-36 bg-slate-100 text-gray-500 rounded shadow-lg z-10"
                  onMouseLeave={() => setDropdownVisible(false)}
                >
                  <p
                    className="px-4 py-2 cursor-pointer hover:text-black"
                    onClick={() => navigate('/profile')}
                  >
                    My Profile
                  </p>
                  <p
                    className="px-4 py-2 cursor-pointer hover:text-black"
                    onClick={() => navigate('/userorders')}
                  >
                    Orders
                  </p>
                  <p
                    className="px-4 py-2 cursor-pointer hover:text-black"
                    onClick={() => navigate('/add-product')}
                  >
                    Add Products
                  </p>
                  <p
                    className="px-4 py-2 cursor-pointer hover:text-black"
                    onClick={logoutHandler}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative">
              <img src={assets.cartIcon} className="w-5 min-w-5" alt="Cart" />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {totalCartCount}
              </p>
            </Link>

            {/* Mobile Menu Icon */}
            <img
              onClick={() => setVisible((prev) => !prev)} // Toggle visibility
              src={assets.menuIcon}
              className="w-5 cursor-pointer sm:hidden"
              aria-label="Open menu"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-0 right-0  bg-white z-50 shadow-md sm:hidden overflow-x-hidden transition-width duration-300 
            ${visible ? 'w-full' : 'w-0'
            }`}

        >
          <div className="flex flex-col h-[100vh] text-gray-600">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-3 cursor-pointer"
              aria-label="Close menu"
            >
              <img
                src={assets.dropdownIcon}
                className="h-4 rotate-180"
                alt="Back"
              />
              <p>Back</p>
            </div>
              <NavLink to="/" className="py-2 pl-6 border" onClick={() => setVisible(false) }>
                HOME
              </NavLink>
              <NavLink to="/productlist" className="py-2 pl-6 border" onClick={() => setVisible(false)}>
                COLLECTION
              </NavLink>
              <NavLink to="/about" className="py-2 pl-6 border" onClick={() => setVisible(false)}>
                ABOUT
              </NavLink>
              <NavLink to="/contact" className="py-2 pl-6 border" onClick={() => setVisible(false)}>
                CONTACT
              </NavLink>

          </div>
        </div>
      </div>

      {/* Search Box */}
      {location.pathname === '/productlist' && (
        <div
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${searchVisible ? 'max-h-40' : 'max-h-0'
            }`}
        >
          <div className="bg-gray-100 py-4 shadow-md" ref={searchBoxRef}>
            <div className="flex justify-center">
              <div className="relative w-3/4 sm:w-1/2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none"
                />
                <img
                  src={assets.searchIcon}
                  alt="search"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
