import { createSlice } from "@reduxjs/toolkit";
// 輔助函式：檢查 cookie 是否有 token (假設你的 token 名稱是 hexToken)
const checkToken = () => {
  return document.cookie.split("; ").some((row) => row.startsWith("onion="));
};
export const authSlice = createSlice({
  name: 'auth',
  initialState:{
    isLoggedIn: checkToken(),
    isInBackend: false,
  },
  reducers: {
    setLoginStatus: (state,action) => {
      state.isLoggedIn = action.payload;
    },
    setIsInBackend: (state,action) => {
      state.isInBackend = action.payload;
    }
  }
})

export const  {setLoginStatus, setIsInBackend} = authSlice.actions;
export default authSlice.reducer;