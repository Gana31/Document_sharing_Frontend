import { toast } from "react-toastify";
import { LOGIN_API, SIGNUP_API } from "../../data/constant";
import { setLoading, setLoginData } from "../../slices/authslice"
import apiClient from "../ApiConnect";


export function login(email, password, navigate) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiClient.post(LOGIN_API, {
            email,
            password,
          });
            // console.log(response.data.data.user1)
          if (response.data.success) {
            const { accessToken, user1 } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user',JSON.stringify( user1))
            navigate('/productlist');
            toast.success('Logged in successfully');
            dispatch(setLoginData({user: user1,accessToken}))
            
          } else {
            navigate("/")
            console.log("lognn reposnse",response)
            toast.error(response.data.message);
          }
        
  
      
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed")
        navigate("/")
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
        console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed")
        navigate("/")
      }
      dispatch(setLoading(false))

    }
  }


  export function logout(navigate) {
    return (dispatch) => {
      dispatch(setLoginData({ user: null, accessToken: null }))
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }
  
