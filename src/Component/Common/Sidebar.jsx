import React from 'react';
import { NavLink } from 'react-router-dom';
import assets from '../../assets';


const Sidebar = () => {
  const navLinkStyles =
    'flex items-center gap-3 rounded-l  border-gray-300 px-3 py-2 ';

  return (
    <div className="w-[18%] min-h-screen border-r-2 border-gray-300">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className={({ isActive }) =>
            `${navLinkStyles} ${isActive ? 'active font-semibold' : ''}`
          }
          to="/add-product"
        >
          <img className="w-5 h-5" src={assets.addicon} alt="Add items icon" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${navLinkStyles} ${isActive ? 'active font-semibold' : ''}`
          }
          to="/list-product"
        >
          <img
            className="w-5 h-5"
            src={assets.ordericon}
            alt="List items icon"
          />
          <p className="hidden md:block">List Items</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;