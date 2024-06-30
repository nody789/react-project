import {configureStore} from "@reduxjs/toolkit";
import messageReducer from "./slice/messageSlice";
import uploadImgReducer from "./slice/uploadImgSlice"
import favoritesReducer, { loadFavorites } from './slice/favoritesSlice';

export const store = configureStore({
    reducer:{
        message:messageReducer,
        uploadImg: uploadImgReducer,
        favorites: favoritesReducer,
    }
});
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
store.dispatch(loadFavorites(favorites));