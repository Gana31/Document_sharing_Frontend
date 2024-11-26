import { toast } from "react-toastify";
import { GET_CATEGORIES, GET_USER_PRODUCT, PRODUCTBYID, PRODUCTLIST } from "../../data/constant";
import { setLoading } from "../../slices/authslice";
import apiClient from "../ApiConnect";
import { setCategories, setProduct, setSingleProduct, setUserProducts } from "../../slices/productslice";

export function GetALLProduct() {
  return async (dispatch) => {

    try {
      dispatch(setLoading(true))
      const response = await apiClient.get(PRODUCTLIST);
      if (response.data.success) {
        dispatch(setProduct(response.data.data))
      } else {
        toast.error(response.data.message);
      }
      const categoryResponse = await apiClient.get(GET_CATEGORIES);
      if (categoryResponse.data.success) {
        dispatch(setCategories(categoryResponse.data.data || [])); 
      } else {
        toast.error(categoryResponse.data.message);
      }

    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    finally{
      dispatch(setLoading(false))
    }

  }
}


export function GetProductId(id) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await apiClient.get(`${PRODUCTBYID}/${id.product}`);
      if (response.data.success) {
        dispatch(setSingleProduct(response.data.data))
      } else {
        // console.log("lognn reposnse",response)
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))

  }
}


export function SetUserProudct(id) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    try {
      if (id) {
        const response = await apiClient.get(`${GET_USER_PRODUCT}/${id}`);
        // console.log(response.data.data)
        if (response.data.success) {
          dispatch(setUserProducts(response.data.data))
          
        } else {
          toast.error(response.data.message);
        }
      }

    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error(error.response.data.message || "error while proudct fetching")
    }finally{
      dispatch(setLoading(false))
    }

  }
}