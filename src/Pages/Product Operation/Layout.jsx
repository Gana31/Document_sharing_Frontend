import React from 'react'
import Sidebar from '../../Component/Common/Sidebar'

function Layout({ children }) {
  return (
    <div className="flex w-full">
    <Sidebar />
    <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
      {children}
    </div>
  </div>
  )
}

export default Layout


