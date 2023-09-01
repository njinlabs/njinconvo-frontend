import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type WebSlice = {
  active: string;
};

const initialState: WebSlice = {
  active: "Dashboard",
};

export const webSlice = createSlice({
  name: "web",
  initialState,
  reducers: {
    setWeb: (state, { payload }: PayloadAction<Partial<WebSlice>>) => {
      state = { ...state, ...payload };
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWeb } = webSlice.actions;

export default webSlice.reducer;
