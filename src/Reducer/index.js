import { combineReducers } from "@reduxjs/toolkit"
import authReducer from '../slices/authslice'
import productReducer from '../slices/productslice'
const rootReducer  = combineReducers({
    auth: authReducer,
    product:productReducer,
})

export default rootReducer