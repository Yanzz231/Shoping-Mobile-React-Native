import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// REDUX
import {useSelector} from 'react-redux';

// TAILWIND
import tw from 'twrnc';

export default function MyProductsScreen() {

    // NAVIGATION
    const navigation = useNavigation();

    const products = useSelector((state) => state.product);

    const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

    const [isLoop, setLoop] = useState(true);
    const [data, setData] = useState([]);

    const fetchProducts = async () => {
        try {
            const dataCheck = [];
            const promises = [];

            for (let i = 1; i < 100; i++) {
                if (products[`product-${i}`] !== undefined && products[`product-${i}`].status === true) {
                    const productId = products[`product-${i}`].id;
                    promises.push(fetch(`https://fakestoreapi.com/products/${productId}`).then((res) => res.json()));
                }
            }

            const responses = await Promise.all(promises);
            setData(responses)
            setLoop(false)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        if (isLoop) {
            fetchProducts()
        }
    }, []);

    const handleProductPress = (productId) => {
        navigation.navigate(`detail`, {id: productId});
    };

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            <View style={isDarkMode ? tw`bg-gray-800 p-4` : tw`bg-purple-600 p-4`}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={tw`text-white text-lg font-bold`}>{'<'} My Products</Text>
                </TouchableOpacity>
            </View>

            {data.length === 0 && <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-lg font-bold text-gray-800`}>Product not found</Text>
            </View>}

            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => handleProductPress(item.id)}
                                      style={tw`w-full`}>
                        <View
                            style={isDarkMode ?
                                tw`bg-gray-800 p-4 rounded-md mb-4 shadow-md flex-row items-center` :
                                tw`bg-white p-4 rounded-md mb-4 shadow-md flex-row items-center`}>
                            <Image source={{uri: item.image}}
                                   style={tw`w-16 h-16 rounded`}/>
                            <View style={tw`ml-4 flex-1`}>
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
                contentContainerStyle={tw`px-4 mt-5`}
            />
        </View>
    );
}
