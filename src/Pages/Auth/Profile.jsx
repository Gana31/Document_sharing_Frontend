import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import apiClient from "../../Services/ApiConnect";
import { UPDATE_USER_PROFILE } from "../../data/constant";
import LoadingSpinner from "../../Component/Common/LoadingSpinner";
import { setLoading, updateUser } from "../../slices/authslice"; // Import updateUser action
import CountryCode from "../../data/countrycode.json";
import { Navigate } from "react-router-dom";

const img_urls = [
  "https://res.cloudinary.com/dnyhn7loo/image/upload/v1732534321/profile_images/g1xzno2gegyixplrqky2.webp",
  "https://res.cloudinary.com/dnyhn7loo/image/upload/v1732534320/profile_images/xyrs8o9vgo8qjhz1dlaw.webp",
  "https://res.cloudinary.com/dnyhn7loo/image/upload/v1732534320/profile_images/lhwlf42g7q5wzqafrkfu.webp",
  "https://res.cloudinary.com/dnyhn7loo/image/upload/v1732534320/profile_images/mzsr5qkbppzbix9xl89w.webp",
  "https://res.cloudinary.com/dnyhn7loo/image/upload/v1732534320/profile_images/kpt4t3bkjkvi63gtaduy.webp",
];

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    address: "",
    mobile_no: "",
    country: "",
    gender: "",
  });
  const [showGallery, setShowGallery] = useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        avatar: user.avatar || img_urls[0],
        address: user.address || "",
        mobile_no: user.mobile_no || "",
        country: user.country || "",
        gender: user.gender || "",
      });
      setSearch(user.country || "");
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login page if no user data
  }

  const handleImageSelect = (url) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
    setShowGallery(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required.";
    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = "Mobile Number is required.";
    } else if (!/^\d+$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Mobile number must contain only digits.";
    } else if (formData.mobile_no.length !== 10) {
      newErrors.mobile_no = "Mobile Number must be exactly 10 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form before proceeding
    if (!validateForm()) return;
  
    // Prepare changes object with only modified fields
    const changes = {};
  
    // Check for changes in formData
    if (formData.name !== user.name) changes.name = formData.name;
    if (formData.avatar !== user.avatar) changes.avatar = formData.avatar;
    if (formData.address !== user.address) changes.address = formData.address;
    if (formData.mobile_no !== user.mobile_no) changes.mobile_no = formData.mobile_no;
    if (formData.country !== user.country) changes.country = formData.country;
    if (formData.gender !== user.gender) changes.gender = formData.gender;
  
    // If there are changes, send them to the backend
    if (Object.keys(changes).length > 0) {
      try {
        setLoader(true);
        const response = await apiClient.put(
          `${UPDATE_USER_PROFILE}/${user.id}`,
          changes // Send only the changes to the backend
        );
  
        if (response.data.success) {
          toast.success("Profile updated successfully");

          dispatch(updateUser(response.data.data)); 
          localStorage.setItem("user", JSON.stringify(response.data.data)); 
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update profile");
      } finally {
        setLoader(false);
      }
    } else {
      toast.info("No changes detected.");
    }
  };

  const filteredCountries = CountryCode.filter((c) =>
    c.country.toLowerCase().includes(search?.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md items-start gap-4 bg-white p-6 shadow-lg rounded-lg"
      >
        {/* Profile Picture */}
        <div className="relative group w-20 h-20 self-center">
          <img
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-300"
            src={formData.avatar}
            alt="Profile"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setShowGallery(!showGallery)}
          >
            <i className="fas fa-camera text-white text-2xl"></i>
          </div>
        </div>
        {showGallery && (
          <div className="flex gap-3 flex-wrap justify-center z-40 bg-white pt-6">
            {img_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Option ${index}`}
                className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                onClick={() => handleImageSelect(url)}
              />
            ))}
          </div>
        )}

        {/* Other Form Fields */}
        <div className="w-full">
          <label className="block mb-2">{user.email}</label>
        </div>

        <div className="w-full">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="w-full">
          <label className="block mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block mb-2">Mobile Number</label>
          <input
            type="text"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleChange}
            maxLength="10"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.mobile_no && (
            <p className="text-red-500 text-sm">{errors.mobile_no}</p>
          )}
        </div>

        <div className="w-full relative">
          <label className="block mb-2">Country</label>
          <input
            type="text"
            placeholder="Search Country"
            value={search}
            onClick={() => setShowDropdown(!showDropdown)}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            className="w-full px-3 py-2 border rounded"
          />
          {showDropdown && (
            <div className="absolute z-10 border rounded bg-white w-full max-h-40 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${
                      formData.country === c.country ? "bg-gray-300" : ""
                    }`}
                    onClick={() => {
                      setSearch(c.country);
                      setFormData({ ...formData, country: c.country });
                      setShowDropdown(false);
                    }}
                  >
                    {c.country}
                  </div>
                ))
              ) : (
                <p className="px-3 py-2 text-gray-500">No country found</p>
              )}
            </div>
          )}
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg"
          disabled={loader}
        >
          {loader ? <LoadingSpinner size="w-5 h-5" color="white" /> : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
