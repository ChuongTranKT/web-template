import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./slices/counterSlice"
import aboutUsReducer from "./slices/aboutUsSlice"
import authReducer from "./slices/authSlice"
import bannerReducer from "./slices/bannerSlice"
import categoryReducer from "./slices/categorySlice"
import productReducer from "./slices/productSlice"
import additionalrReducer from "./slices/additionalServicesSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Thêm reducer tại đây
    auth: authReducer,
    aboutUs: aboutUsReducer,
    banner: bannerReducer,
    category: categoryReducer,
    product: productReducer,
    additional: additionalrReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
