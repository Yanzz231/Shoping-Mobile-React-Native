import {Tabs} from 'expo-router';
import React from 'react';

import {IconSymbol} from '@/components/ui/IconSymbol';

export default () => {
    return (
        <Tabs screenOptions={{ headerShown: false }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Homes',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
                }}
            />

            <Tabs.Screen
                name="product"
                options={{
                    title: 'My Product',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
                }}
            />
        </Tabs>
    )
}
