import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from '../../data/countrycode.json'


const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    // console.log("Form Data - ", data)
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="text-[14px] text-black">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter first name"
            className="rounded-lg bg-gray-300 p-3 text-[16px] leading-[24px] text-black shadow-[0_1px_0_0] shadow-white/50 placeholder:text-black focus:outline-none"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[20px] text-red-700">
              {typeof errors.firstname === "string" ? errors.firstname : "Please enter your name."}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="text-[14px] text-black">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter last name"
            className="rounded-lg bg-gray-300 p-3 text-[16px] leading-[24px] text-black shadow-[0_1px_0_0] shadow-white/50 placeholder:text-black focus:outline-none"
            {...register("lastname")}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[20px] text-red-700">
              {typeof errors.lastname === "string" ? errors.lastname : "Please enter your Lastname."}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-[14px] text-black">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          className="rounded-lg bg-gray-300 p-3 text-[16px] leading-[24px] text-black shadow-[0_1px_0_0] shadow-white/50 placeholder:text-black focus:outline-none"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[20px] text-red-700">
            {typeof errors.email === "string" ? errors.email : "Please enter your Email address."}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNo" className="text-[14px] text-black">
          Phone Number
        </label>

        <div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              id="countrycode"
              className="rounded-lg bg-gray-300 p-3 text-[16px] leading-[24px] text-black shadow-[0_1px_0_0] shadow-white/50 placeholder:text-black focus:outline-none"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((ele, i) => (
                <option key={i} value={ele.code}>
                  {ele.code} - {ele.country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              id="phoneNo"
              placeholder="12345 67890"
              className="rounded-lg bg-gray-300 p-3 text-[16px] leading-[24px] text-black shadow-[0_1px_0_0] shadow-white/50 placeholder:text-black focus:outline-none"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNo?.message && (
          <span className="-mt-1 text-[20px] text-red-700">
            {typeof errors.phoneNo.message === "string" ? errors.phoneNo.message : ""}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-[14px] text-black">
          Message
        </label>
        <textarea
          id="message"
          cols={30}
          rows={7}
          placeholder="Enter your message here"
          className="rounded-lg bg-gray-300 p-3 text-[16px] leading-[24px] text-black shadow-[0_1px_0_0] shadow-white/50 placeholder:text-black focus:outline-none"
          {...register("message", { required: true })}
        />
       {errors.message && (
            <span className="-mt-1 text-[20px] text-red-700">
              {typeof errors.message === "string" ? errors.message : "Please enter your Message."}
            </span>
          )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md  bg-black text-white px-6 py-3 text-center text-[13px] font-bold  shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
