
import { createSlice } from '@reduxjs/toolkit'; 

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      state.push(action.payload);
      localStorage.setItem('favorites', JSON.stringify(state));
      console.log(state,action)
    },
    removeFavorite: (state, action) => {
      const newState = state.filter(item => item.id !== action.payload.id);
      localStorage.setItem('favorites', JSON.stringify(newState));
      return newState;
    },
    loadFavorites(state, action) {
      return action.payload || [];
    },
  },
});

export const { addFavorite, removeFavorite,loadFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;