import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Define the BannerType
type CategoryType = {
  category_name: string
  description: string
  category_image: string
}

// Giá trị mặc định của state
const initialState = {
  category: <CategoryType[]>[
    {
      category_name: "",
      description: "",
      category_image: "",
    },
  ],
}

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload
    },
    clearCategory: (state) => {
      state.category = initialState.category
    },
  },
})

export const { setCategory, clearCategory } = categorySlice.actions

export default categorySlice.reducer
