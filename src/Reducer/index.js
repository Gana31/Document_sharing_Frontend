import { combineReducers } from "@reduxjs/toolkit"
import authReducer from '../slices/authslice'
import productReducer from '../slices/productslice'
import cartReducer from '../slices/cartslice'
const rootReducer  = combineReducers({
    auth: authReducer,
    product:productReducer,
    cart:cartReducer,
})

export default rootReducer