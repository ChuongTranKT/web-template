import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Define the BannerType
type AdditionalType = {
  service_name: string
  description: string
}

// Giá trị mặc định của state
const initialState = {
  additional: <AdditionalType[]>[
    {
      description: "",
      service_name: "",
    },
  ],
}

export const additionalSlice = createSlice({
  name: "additional",
  initialState,
  reducers: {
    setAdditional: (state, action) => {
      state.additional = action.payload
    },
    clearAdditional: (state) => {
      state.additional = initialState.additional
    },
  },
})

export const { setAdditional, clearAdditional } = additionalSlice.actions

export default additionalSlice.reducer
