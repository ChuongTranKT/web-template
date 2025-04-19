import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Định nghĩa kiểu dữ liệu của state
interface CounterState {
  value: number
}

// Giá trị mặc định của state
const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.value = action.payload
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
