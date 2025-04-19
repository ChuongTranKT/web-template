import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Giá trị mặc định của state
const initialState = {
  aboutUs: {
    _id: "",
    company_name: "",
    logo: "",
    slogan: "",
    description: "",
    history: "",
    vision: "",
    mission: "",
    open_time: "",
    address: "",
    phone: "",
    email: "",
    facebook_link: "",
    twitter_link: "",
    instagram_link: "",
    linkedin_link: "",
    map: "",
  },
}

export const aboutUsSlice = createSlice({
  name: "aboutUs",
  initialState,
  reducers: {
    setAboutUs: (state, action) => {
      state.aboutUs = action.payload
    },
    clearAboutUs: (state) => {
      state.aboutUs = initialState.aboutUs
    },
  },
})

export const { setAboutUs, clearAboutUs } = aboutUsSlice.actions

export default aboutUsSlice.reducer
