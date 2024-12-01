// export const BASE_URL = "http://localhost:8080/api/v1"
export const BASE_URL = "https://document-sharing.vercel.app/api/v1"


export const SIGNUP_API = BASE_URL + "/userregister"

export const LOGIN_API= BASE_URL + "/userlogin"

export const LOGOUT= BASE_URL + "/userLogout"
export const PRODUCTLIST= BASE_URL + "/getallproduct"
export const PRODUCTBYID= BASE_URL + "/getproductbyid"
export const ADDPRODUCT= "/createproduct"

export const GET_PRODUCT_BY_NAME = BASE_URL + "/getproductbyname"


export const GET_CATEGORIES= BASE_URL + "/getAllCategories"

export const GET_USER_PRODUCT="/getallproductByUserId"

export const DELETE_PRODUCT="/deleteproduct"

export const UPDATE_PRODUCT="/updateproduct"

export const CREATE_ORDER="/createOrder"

export const USER_PREVIOUS_ORDERS="/getAllPreviousOrders"

export const GET_CATEGORIES_BY_USERID="/getProductByUserId"

export const ADD_CATEGORY="/createCategory"

export const DELETE_CATEGORY="/deleteCategory"

export const UPDATE_CATEGORY="/updateCategory"


export const GET_USER_PROFILE="/userDetails"

export const UPDATE_USER_PROFILE="/userupdate"

export const CONTACT_US="/createContactus"
