
import { createSlice } from '@reduxjs/toolkit'; 

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
  },
  reducers: {
    addFavorite: (state, action) => {// 添加收藏
      state.push(action.payload);// 將新收藏項添加到狀態中
      localStorage.setItem('favorites', JSON.stringify(state)); // 同時更新 localStorage，將更新的狀態存儲到本地
    },
    removeFavorite: (state, action) => {// 移除收藏
      const newState = state.filter(item => item.id !== action.payload.id);// 過濾掉與 action.payload.id 匹配的收藏項
      localStorage.setItem('favorites', JSON.stringify(newState)); // 更新 localStorage 中的收藏數據
      return newState; // 返回新狀態（已移除的收藏項）
    },
    loadFavorites(state, action) {
      return action.payload || [];
    },
  },
});

export const { addFavorite, removeFavorite,loadFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;