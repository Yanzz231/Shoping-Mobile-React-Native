import {createStore , combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';

import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

// STORAGE
import AsyncStorage from '@react-native-async-storage/async-storage';

// DATA
import coinReducer from './coinSlice';
import productReducer from './productSlice';
import darkModeSlice from "@/scripts/darkModeSlice";

import {Platform} from 'react-native';

const persistConfig = {
    key: 'roots',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['coin', 'product', 'darkMode']
};

const persistedCoinReducer = persistReducer(persistConfig, coinReducer);
const persistedProductReducer = persistReducer(persistConfig, productReducer);
const persistedDarkmodeReducer = persistReducer(persistConfig, darkModeSlice);

const rootReducer = combineReducers({
    coin: persistedCoinReducer,
    product: persistedProductReducer,
    darkMode: persistedDarkmodeReducer
})

export const store = createStore(rootReducer)
export const persistor = persistStore(store);
