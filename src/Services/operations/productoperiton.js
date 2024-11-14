import { toast } from "react-toastify";
import { PRODUCTBYID, PRODUCTLIST } from "../../data/constant";
import { setLoading } from "../../slices/authslice";
import apiClient from "../ApiConnect";
import { setProduct } from "../../slices/productslice";

export function GetALLProduct() {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiClient.get(PRODUCTLIST);
            // console.log(response.data.data.user1)
          if (response.data.success) {
            // console.log(response)
            dispatch(setProduct(response.data.data))
            
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


  export function GetProductId(id) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiClient.get(`${PRODUCTBYID}/${id.product}`);
            // console.log(response.data)
          if (response.data.success) {
            return response.data
            // console.log(response)
            
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