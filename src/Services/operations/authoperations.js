import { toast } from "react-toastify";
import { LOGIN_API, LOGOUT, SIGNUP_API } from "../../data/constant";
import { setLoading, setLoginData } from "../../slices/authslice"
import apiClient from "../ApiConnect";
import { setUserProducts } from "../../slices/productslice";


export function login(email, password, navigate) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiClient.post(LOGIN_API, {
            email,
            password,
          });
          if (response.data.success) {
            const {user2 } = response.data.data;

            localStorage.setItem('accessToken', true);
            localStorage.setItem('user',JSON.stringify( user2))
            navigate('/productlist');
            toast.success('Logged in successfully');
            dispatch(setLoginData({user: user2,accessToken : true}))
            
          } 
            navigate("/")
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error(error.response.data.message || "Login Failed")
      }
      dispatch(setLoading(false))

    }
  }

  export function Register(name,email, password, navigate) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiClient.post(SIGNUP_API, {
            name,
            email,
            password,
          });
          if (response.data.success) {
            toast.success('User registered successfully');
            
          } else {
            console.log("reseger reposnse",response)
            toast.error(response.data.message);
          }
      } catch (error) {
        // console.log("LOGIN API ERROR............", error)
        toast.error(error.response.data.message ||"Login Failed")
        navigate("/")
      }
      dispatch(setLoading(false))

    }
  }


  export function logout(navigate) {
    return async (dispatch) => {

      try {
        const response = await apiClient.post(LOGOUT);
          if (response.data.success) {
            dispatch(setLoginData({ user: null, accessToken: null }))
            dispatch(setUserProducts([])); 
            localStorage.removeItem("accessToken")
            localStorage.removeItem("user")
            toast.success("Logged Out")
            navigate("/")  
          } else {
            console.log("reseger reposnse",response)
            toast.error(response.data.message);
          }
     
    }catch (error) {
      // console.log("LOGIN API ERROR............", error)
      toast.error(error.response.data.message ||"Login Failed")
      navigate("/")
    }
  }
}
