import { toast } from "react-toastify";
import { setLoading } from "../../slices/authslice";
import apiClient from "../ApiConnect";
import { addOrUpdateProduct } from "../../slices/cartslice";


export function addToCart(product, quantity) {
    return async (dispatch) => {
    //   dispatch(setLoading(true))
      try {
        console.log("Dispatching addOrUpdateProduct with", { product, quantity });
        dispatch(addOrUpdateProduct({ product, quantity }));

      toast.success("Product added to cart!");
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed")
      }
    //   dispatch(setLoading(false))

    }
  }
