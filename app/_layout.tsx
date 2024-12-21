import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {store, persistor} from '../scripts/store';
import React, {useEffect} from 'react';
import { useFonts } from 'expo-font';
import { useColorScheme } from '@/hooks/useColorScheme';

// REDUX
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

// PAGE
import DetailProduct from "@/app/detail";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="+not-found"/>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </PersistGate>
        </Provider>
    );
}
