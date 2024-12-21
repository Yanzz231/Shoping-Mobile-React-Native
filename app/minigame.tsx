import React, {useState, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, Animated} from 'react-native';

// NAVIGATION
import {useNavigation} from '@react-navigation/native';

// TAILWIND
import tw from 'twrnc';

// REDUX
import {useSelector, useDispatch} from 'react-redux';
import {setCoin} from "@/scripts/coinSlice";

const MiniGameScreen: React.FC = () => {

    const navigation = useNavigation();

    // DARKMODE
    const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

    // COIN
    const coin = useSelector((state) => state.coin.value)

    const [pressCount, setPressCount] = useState(0);
    const [isBroken, setIsBroken] = useState(false);
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const [price, setPrice] = useState(0);

    const dispatch = useDispatch();

    const handleEggClick = () => {
        const newPressCount = pressCount + 1;
        setPressCount(newPressCount);

        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        if (newPressCount === 3) {
            const randomNumber = Math.floor(Math.random() * 3) + 1;
            switch (randomNumber) {
                case 1:
                    dispatch(setCoin(coin + 100));
                    break;
                case 2:
                    dispatch(setCoin(coin + 50));
                    break;
                case 3:
                    dispatch(setCoin(coin + 20));
                    break;
            }
            setPrice(randomNumber)
            setIsBroken(true);
        } else if (newPressCount > 3) {
            setPrice(0)
            setIsBroken(false);
            setPressCount(0);
        }
    };

    const shakeInterpolate = shakeAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-10deg', '10deg'],
    });

    const animatedStyle = {
        transform: [{rotate: shakeInterpolate}],
    };


    return (
        <View style={isDarkMode ? tw`flex-1 bg-gray-700 p-5` : tw`flex-1 bg-gray-100 p-5`}>

            <View style={tw`flex-row items-center`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
                    <Text
                        style={tw`text-lg ${isDarkMode ? "text-white" : "text-purple-600"} font-bold`}>{'<'} Back</Text>
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Minigame</Text>
            </View>

            <View style={tw`flex-row justify-center mt-6`}>
                <View style={tw`flex-row items-center mx-3`}>
                    <Image
                        source={require("../assets/images/gold-coin.png")}
                        style={tw`w-12 h-12`}
                    />
                    <Text style={tw`ml-2 ${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>100</Text>
                </View>
                <View style={tw`flex-row items-center mx-3`}>
                    <Image
                        source={require("../assets/images/silver-coin.png")}
                        style={tw`w-12 h-12`}
                    />
                    <Text style={tw`ml-2 ${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>50</Text>
                </View>
                <View style={tw`flex-row items-center mx-3`}>
                    <Image
                        source={require("../assets/images/bronze-coin.png")}
                        style={tw`w-12 h-12`}
                    />
                    <Text style={tw`ml-2 ${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>20</Text>
                </View>
            </View>

            <Text style={tw`mt-8 text-center ${isDarkMode ? "text-white" : "text-gray-800"} text-xl relative`}>
                {isBroken ? <><Text style={tw`font-bold absolute top-1`}>Congratulations</Text>
                    <Text style={tw`absolute`}>{`\nYou got a ${price == 1 ? "gold coin!" : price == 2 ? "silver coin!" : "bronze coin!"}`}</Text></> : "Click on the egg to get your prize!"}
            </Text>


            <TouchableOpacity
                onPress={handleEggClick}
                style={tw`mt-20 self-center relative`}
            >
                <View style={tw`self-center absolute top-2 bottom-1`}>
                    {price === 1 && isBroken ? <Image source={require(`../assets/images/gold-coin.png`)} style={tw`w-20 h-20`}/> :
                        price === 2 && isBroken ?
                            <Image source={require(`../assets/images/silver-coin.png`)} style={tw`w-20 h-20`}/> :
                            price === 3 ? <Image source={require(`../assets/images/bronze-coin.png`)} style={tw`w-20 h-20`}/> : ""}
                </View>
                <Animated.Image
                    source={
                        isBroken
                            ? require('../assets/images/egg-broken.png')
                            : require('../assets/images/egg-full.png')
                    }
                    style={[tw`w-40 h-48 mt-16`, animatedStyle]}
                />
            </TouchableOpacity>

            <Text style={tw`text-center ${isDarkMode ? "text-white" : "text-gray-800"} mt-5`}>
                {isBroken ? "The egg is broken!" : ``}
            </Text>

        </View>
    );
};

export default MiniGameScreen;
