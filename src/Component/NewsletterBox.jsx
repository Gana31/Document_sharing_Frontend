import React from 'react';
import {toast} from 'react-toastify'
const NewsLetterBox = () => {
  const onSumbitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className=" text-center ">
      <p className=" text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off
      </p>
      <p className=" text-gray-400 mt-3">
      Stay updated with our latest offers and news! Subscribe to our newsletter for exclusive deals, product launches, and more.
      </p>
      <form
        className=" w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 "
        onSubmit={onSumbitHandler}
      >
        <input
          className=" w-full sm:flex-1 outline-none border-none"
          type="email"
          name=""
          id=""
          placeholder="Enter Your email"
          required
        />
        <button
          type="submit"
          className=" bg-black text-white text-xs px-10 py-4"
          onClick={(e)=>toast.success("News Letter will reach you soon  ")}
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;