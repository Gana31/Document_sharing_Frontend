import { toast } from "react-toastify";
import { setLoading } from "../../slices/authslice";
import apiClient from "../ApiConnect";
import { addOrUpdateProduct, clearCart } from "../../slices/cartslice";
import { CREATE_ORDER, RAZORPAY_KEY, VERIFY_PAYMENT } from "../../data/constant";

// Add product to cart
export function addToCart(product, quantity) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            if (product.access_mode === "online") {
                dispatch(addOrUpdateProduct({ product, quantity: 0 }));
            }
            dispatch(addOrUpdateProduct({ product, quantity }));
            toast.success("Product added to cart!");
        } catch (error) {
            console.log("Add to Cart Error:", error);
            toast.error("Failed to add product to cart.");
        }
        dispatch(setLoading(false));
    };
}

// Load Razorpay script dynamically
function loadRazorpayScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.body.appendChild(script);
    });
}

// Proceed to buy and open Razorpay window
export function ProccedToBuy(userid, products, total,user) {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            // Step 1: Load Razorpay script dynamically
            const isScriptLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!isScriptLoaded) {
                toast.error("Razorpay SDK failed to load. Please try again.");
                dispatch(setLoading(false));
                return;
            }

            // Step 2: Create the order on the backend
            const orderData = {
                userId: userid,
                products: products.map((product) => ({
                    productId: product.id,
                    quantity: product.quantity,
                })),
                frontendTotal: total,
            };

            const response = await apiClient.post(CREATE_ORDER, orderData);
            console.log(user.mobile_no,user.email,user.name)
            if (response.data.success) {
                const { razorpayOrderId, amount, currency } = response.data.data;

                // Step 3: Configure Razorpay options
                const options = {
                    key: RAZORPAY_KEY,  // Your Razorpay key
                    amount: amount * 100,  // Amount should be in paise
                    currency: currency,
                    name: "BOOK",  // Store name
                    description: "Purchase Order",  // Order description
                    order_id: razorpayOrderId,  // Order ID from the backend
                    handler: async (razorpayResponse) => {
                        // Step 4: Verify payment on backend
                        try {
                            const verifyResponse = await apiClient.post(VERIFY_PAYMENT, {
                                razorpayOrderId: razorpayResponse.razorpay_order_id,
                                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                                razorpaySignature: razorpayResponse.razorpay_signature,
                            });

                            if (verifyResponse.data.success) {
                                toast.success("Payment successful and order placed!");
                                dispatch(clearCart());  // Clear the cart after successful payment
                            } else {
                                toast.error("Payment verification failed.");
                            }
                        } catch (error) {
                            console.error("Payment verification error:", error);
                            toast.error("Payment verification failed.");
                        }
                    },
                    prefill: {
                        name: user.name,  // Replace with actual user data if available
                        email: user.email,  // Replace with actual email
                        contact: user.mobile_no,  // Replace with actual contact number
                    },
                    theme: {
                        color: "#3399cc",  // Razorpay button color
                    },
                };
                

                // Step 5: Launch Razorpay Checkout
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error(response.data.message || "Failed to create order.");
            }
        } catch (error) {
            console.error("ProccedToBuy Error:", error);
            toast.error("Failed to process your order.");
        }

        dispatch(setLoading(false));
    };
}
