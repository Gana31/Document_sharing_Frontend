import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import assets from '../../assets';
import { logout } from '../../Services/operations/authoperations';
import { selectCartTotalCount } from '../../slices/cartslice';

const Header = () => {
  const [visible, setVisible] = useState(false); // Mobile sidebar visibility
  const [dropdownVisible, setDropdownVisible] = useState(false); // Profile dropdown visibility
  const { accessToken } = useSelector((state) => state.auth);
  const totalCartCount = useSelector(selectCartTotalCount);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div className="flex items-center px-5 justify-between py-5 font-medium h-16">
      {/* Logo */}
      <p>
        <Link to="/">BOOk</Link>
      </p>

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
        <img
          src={assets.searchIcon}
          alt="search"
          className="w-5 cursor-pointer"
        />

        {/* Profile Icon and Dropdown */}
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

          {/* Dropdown Menu */}
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
                onClick={() => dispatch(logout(navigate))}
              >
                Logout
              </p>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img src={assets.cartIcon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {totalCartCount}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menuIcon}
          className="w-5 cursor-pointer sm:hidden"
          aria-label="Open menu"
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 bg-white overflow-hidden transition-all duration-300 ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-600">
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
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/productlist"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
