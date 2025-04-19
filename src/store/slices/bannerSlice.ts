import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Define the BannerType
type BannerType = {
  title: string
  image_url: string[]
  description: string
  _id: string
  display_page: string
  image_delete: string
}

// Giá trị mặc định của state
const initialState = {
  banner: <BannerType[]>[
    {
      title: "",
      image_url: [],
      description: "",
      _id: "",
      display_page: "",
      image_delete: "",
    },
  ],
}

export const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    setBanner: (state, action) => {
      state.banner = action.payload
    },
    clearBanner: (state) => {
      state.banner = initialState.banner
    },
  },
})

export const { setBanner, clearBanner } = bannerSlice.actions

export default bannerSlice.reducer
