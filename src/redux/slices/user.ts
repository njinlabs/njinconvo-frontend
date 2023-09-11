import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FileObject } from "../../apis/group/meeting/store";

export type UserData = {
  id?: number;
  email: string;
  fullname: string;
  password?: string;
  avatar?: File | FileObject | null;
  gender: string;
  birthday: string;
  role: string;
};

export type UserSlice = {
  isLogged: boolean;
  data: Partial<UserData> | null;
};

const initialState: UserSlice = {
  isLogged: false,
  data: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<Partial<UserData>>) => {
      state.isLogged = true;
      state.data = payload;
      return state;
    },
    clearUser: (state) => {
      state.isLogged = false;
      state.data = null;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
