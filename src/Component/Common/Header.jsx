import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import assets from '../../assets';
import { logout } from '../../Services/operations/authoperations';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="flex items-center px-5 justify-between py-5 font-medium h-16">
      <p><Link to="/">
          BOOk
        </Link></p>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/productlist" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => ""}
          src={assets.searchIcon}
          alt="search"
          className="w-5 cursor-pointer"
        />

        <div className="group relative">
          <img
            onClick={() => (!accessToken ? navigate('/login') : null )}
            src={assets.profileIcon}
            alt="Profile"
            className="w-5 cursor-pointer"
          />
          {/* drop down menu */}
          {accessToken && (
            <div className="group-hover:block hidden absolute right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-5 bg-slate-100 text-gray-500 rounded p-4">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p onClick={()=>navigate('/')} className="cursor-pointer hover:text-black">Orders</p>
                <p
                  onClick={() => dispatch(logout(navigate))}
                  className="cursor-pointer hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cartIcon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {/* {getCartCount()} */}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menuIcon}
          className="w-5 cursor-pointer sm:hidden"
          aria-label="Open menu"
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 bg-white overflow-hidden transition-width duration-300 ${
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
            to="/collection"
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