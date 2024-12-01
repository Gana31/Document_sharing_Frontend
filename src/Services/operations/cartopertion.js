import { toast } from "react-toastify";
import { setLoading } from "../../slices/authslice";
import apiClient from "../ApiConnect";
import { addOrUpdateProduct, clearCart } from "../../slices/cartslice";
import { CREATE_ORDER } from "../../data/constant";


export function addToCart(product, quantity) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        // console.log("Dispatching addOrUpdateProduct with", { product, quantity });
        if(product.access_mode == "online"){
          dispatch(addOrUpdateProduct({ product, quantity:0 }));
        }
        dispatch(addOrUpdateProduct({ product, quantity }));
      toast.success("Product added to cart!");
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed")
      }
      dispatch(setLoading(false))

    }
  }

  export function ProccedToBuy(userid,products, total) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const orderData = {
          userId: userid, 
          products: products.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          })),
          frontendTotal: total, 
        };

        const response = await apiClient.post(CREATE_ORDER, orderData);
        if(response.data.success){
          toast.success(response.data.message || "Order Place Successfully!");
          dispatch(clearCart());
        }
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed")
      }
      dispatch(setLoading(false))

    }
  }

