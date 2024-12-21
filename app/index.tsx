import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, Image, BackHandler, Alert} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';

// REDUX
import {useSelector, useDispatch} from 'react-redux'

// TOGGLE DARK MODE
import {toggleDarkMode} from '../scripts/darkModeSlice';

// TAILWIND
import tw from 'twrnc';

export default function HomeScreen() {

    const dispatch = useDispatch();

    const coin = useSelector((state) => state.coin.value)

    // DATA
    const [products, setProducts] = useState([]);

    // DARKMODE
    const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

    // LOOP
    const [loop, setLoop] = useState(true);

    // SEARCH
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    // GRID
    const [isGridView, setIsGridView] = useState(false);

    // NAVIGATION
    const navigation = useNavigation();
    const navigationState = useNavigationState((state) => state);

    // FUNCTION
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
            setLoop(false);
        } catch (err) {
            console.log(err.message)
        }
    };

    const handleBackPress = () => {
        Alert.alert(
            "Exit App",
            "Are you sure you want to close Storeegg?",
            [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => BackHandler.exitApp(),
                },
            ],
            {cancelable: false}
        );
        return true;
    };


    useEffect(() => {
        if (searchQuery === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }

        if (loop) {
            fetchProducts();
        }

        if (navigationState.routes[navigationState.index].name === "index") {
            BackHandler.addEventListener("hardwareBackPress", handleBackPress);

            return () => {
                BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
            };
        }

    }, [searchQuery, products, navigationState]);

    const handleProductPress = (productId) => {
        navigation.navigate(`detail`, {id: productId});
    };

    const handleMyProductPress = () => {
        navigation.navigate(`product`,);
    };

    const handleMinigame = () => {
        navigation.navigate(`minigame`,);
    };


    const toggleGridView = () => {
        setIsGridView(!isGridView);
    };

    return (
        <View style={isDarkMode ? tw`flex-1 bg-gray-900` : tw`flex-1 bg-gray-100`}>

            <View
                style={isDarkMode ? tw`bg-gray-800 p-4 flex-row justify-between items-center` : tw`bg-purple-600 p-4 flex-row justify-between items-center`}>
                <TextInput
                    style={isDarkMode ? tw`bg-gray-700 flex-1 rounded-md px-4 py-2 text-white` : tw`bg-white flex-1 rounded-md px-4 py-2`}
                    placeholder="Search Product.."
                    placeholderTextColor={isDarkMode ? 'gray' : 'black'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={tw`ml-4`}>
                    <View style={isDarkMode ? tw`bg-gray-700 px-4 py-2 rounded-md` : tw`bg-white px-4 py-2 rounded-md`}>
                        <Text
                            style={isDarkMode ? tw`text-white font-bold` : tw`text-purple-600 font-bold`}>{coin}</Text>
                        <Text style={isDarkMode ? tw`text-gray-400 text-xs` : tw`text-purple-600 text-xs`}>My
                            coins</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View
                style={isDarkMode ? tw`flex-row items-center bg-gray-800 px-4 py-2 justify-between` : tw`flex-row items-center bg-purple-600 px-4 py-2 justify-between`}>
                <TouchableOpacity onPress={handleMyProductPress}>
                    <Text
                        style={isDarkMode ? tw`text-white font-bold p-2 bg-gray-700 rounded-md` : tw`text-white font-bold p-2 bg-white text-black rounded-md`}>My
                        Products</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dispatch(toggleDarkMode())}>
                    <Text
                        style={isDarkMode ? tw`text-white font-bold p-2 bg-gray-700 rounded-md` : tw`text-white font-bold p-2 bg-white text-black rounded-md`}>
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={tw`px-4 py-4`}>
                <View style={tw`flex-row justify-between items-center`}>
                    <Text style={isDarkMode ? tw`text-white font-bold text-lg` : tw`text-black font-bold text-lg`}>Available
                        Products</Text>
                    <TouchableOpacity style={tw`p-2 bg-gray-200 rounded-md`} onPress={toggleGridView}>
                        <Text style={isDarkMode ? tw`text-gray-400` : tw`text-black`}>🔳</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={isGridView ? 2 : 1}
                key={isGridView ? 'grid' : 'list'}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => handleProductPress(item.id)}
                                      style={isGridView ? tw`w-1/2 p-2` : tw`w-full `}>
                        <View
                            style={isDarkMode ?
                                tw`bg-gray-800 p-4 rounded-md mb-4 shadow-md ${isGridView ? 'items-center' : 'flex-row items-center'}` :
                                tw`bg-white p-4 rounded-md mb-4 shadow-md ${isGridView ? 'items-center' : 'flex-row items-center'}`}>
                            <Image source={{uri: item.image}}
                                   style={isGridView ? tw`w-24 h-24` : tw`w-16 h-16 rounded`}/>
                            <View style={isGridView ? tw`mt-2 items-center` : tw`ml-4 flex-1`}>
                                <Text
                                    style={isDarkMode ? tw`font-bold text-white text-center` : tw`font-bold  text-center`}>
                                    {item.title}
                                </Text>
                                <Text
                                    style={isDarkMode ? tw`text-gray-400 text-center` : tw`text-gray-600 text-center`}>
                                    ${item.price}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={tw`px-4`}
            />

            <TouchableOpacity onPress={handleMinigame}
                              style={tw`absolute right-2 bottom-2 mb-4 mr-2 ${isDarkMode ? "bg-gray-700" : "bg-white"} p-4 rounded-full shadow-lg z-20`}>
                <Image source={require("../assets/images/egg-full.png")} style={tw`w-8 h-10 rounded-md`}/>

            </TouchableOpacity>
        </View>
    );
}
