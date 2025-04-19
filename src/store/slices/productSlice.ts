import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProductType } from "@/types/product" // Đảm bảo import đúng type

// Định nghĩa kiểu dữ liệu ProductType
type ProductType = {
  product_name: string
  category_id: string
  additional_services: string[] // Mảng các chuỗi ID dịch vụ bổ sung
  price: number
  classification: Array<{
    classification: Array<{ key: string; value: string }>
    price: number
    remaining: number
  }> // Phù hợp với cấu trúc của classification
  images: string[] // Mảng chứa các URL hình ảnh
  description: string
  discount_price: number
  stock: number
  priority: boolean
  material: string
  code: string
  warranty: string
}

interface ProductState {
  product: ProductType[]
}

const initialState: ProductState = {
  product: [], // Khởi tạo là mảng rỗng
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<ProductType[]>) => {
      state.product = action.payload
    },
    clearProduct: (state) => {
      state.product = initialState.product
    },
  },
})

export const { setProduct, clearProduct } = productSlice.actions
export default productSlice.reducer
