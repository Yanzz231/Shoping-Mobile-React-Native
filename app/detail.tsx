import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Modal, ScrollView, ActivityIndicator} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {toggleProductStatus, setProductStatus} from '../scripts/productSlice';
import {setCoin} from '../scripts/coinSlice';
import tw from 'twrnc';

export default function DetailProduct() {

    const [isImageFullScreen, setIsImageFullScreen] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLow, setLow] = useState(false)

    const [isModalVisible, setModalVisible] = useState(false);

    const route = useRoute();
    const {id} = route.params || {};
    const navigation = useNavigation();

    const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
    const coin = useSelector((state) => state.coin.value);

    const productStatus = useSelector((state) => state.product[`product-${id}`]);

    const dispatch = useDispatch();

    const fetchProduct = async () => {
        if (!id) return navigation.goBack();

        try {
            setLoading(true);
            const response = await fetch(`https://fakestoreapi.com/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            console.error(err);
            alert('Failed to load product');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleTransaction = (price, type) => {
        if (type === 'Buy') {
            if (coin >= price) {
                dispatch(setCoin(coin - price));
                dispatch(toggleProductStatus(id));
                setModalVisible(true);
            } else {
                setLow(true)
                setModalVisible(true);
            }
        } else if (type === 'Sell') {
            dispatch(setCoin(coin + price));
            dispatch(toggleProductStatus(id));
            setModalVisible(true);
        }
    };

    useEffect(() => {
        if (productStatus === undefined) {
            dispatch(setProductStatus({productId: id, status: false}));
        }
        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="purple"/>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-lg font-bold text-gray-800`}>Product not found</Text>
            </View>
        );
    }

    const SuccessModal = ({visible, onClose, productId, balance}) => {
        return (
            <Modal
                transparent={true}
                animationType="fade"
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
                    <View style={tw`bg-white p-5 rounded-lg w-4/5`}>
                        <Text style={tw`text-lg font-bold mb-3 text-center`}>{isLow ? "Failed" : "Success!"}</Text>
                        <Text style={tw`text-base text-center mb-5`}>
                            {isLow ? "No Have Money HAHAHAHA!" : productStatus?.status ? `Product ${productId} was sold successfully!\nYour current balance is ${balance}.` : `Product ${productId} was bought successfully!\nYour current balance is ${balance}.`}

                        </Text>
                        <TouchableOpacity
                            style={tw`bg-purple-600 py-2 px-5 rounded-md self-center`}
                            onPress={onClose}
                        >
                            <Text style={tw`text-white font-bold`}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={isDarkMode ? tw`flex-1 bg-gray-900` : tw`flex-1 bg-gray-100`}>

            <View
                style={isDarkMode ? tw`bg-gray-800 p-4 flex-row items-center` : tw`bg-purple-600 p-4 flex-row items-center`}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={isDarkMode ? tw`text-white text-lg font-bold` : tw`text-white text-lg font-bold`}>
                        {'<'} Product {product.title}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={tw`p-4`}>
                <TouchableOpacity onPress={() => setIsImageFullScreen(true)}>
                    <Image source={{uri: product.image}} style={tw`w-full h-64 rounded-lg`} resizeMode="contain"/>
                </TouchableOpacity>

                <View style={tw`mt-4`}>
                    <Text style={isDarkMode ? tw`text-white text-lg font-bold` : tw`text-gray-800 text-lg font-bold`}>
                        {product.title}
                    </Text>
                    <Text style={isDarkMode ? tw`text-purple-400 mt-2` : tw`text-purple-600 mt-2`}>
                        ${product.price}
                    </Text>
                    <Text style={isDarkMode ? tw`text-gray-300 mt-4` : tw`text-gray-600 mt-4`}>
                        {product.description}
                    </Text>
                </View>

                <TouchableOpacity
                    style={isDarkMode ? tw`bg-gray-800 mt-8 p-4 rounded-lg` : tw`bg-purple-600 mt-8 p-4 rounded-lg`}
                    onPress={() => handleTransaction(product.price, productStatus?.status ? 'Sell' : 'Buy')}
                >
                    <Text
                        style={isDarkMode ? tw`text-white text-center text-lg font-bold` : tw`text-white text-center text-lg font-bold`}>
                        {productStatus?.status ? 'Sell' : 'Buy'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <SuccessModal onClose={() => setModalVisible(false)} visible={isModalVisible} productId={id}
                          balance={coin}/>

            <Modal visible={isImageFullScreen} transparent={true} animationType="fade">
                <View style={tw`flex-1 bg-black/60 justify-center items-center`}>
                    <TouchableOpacity
                        style={tw`absolute top-4 right-4 bg-white p-2 rounded-full`}
                        onPress={() => setIsImageFullScreen(false)}
                    >
                        <Text style={isDarkMode ? tw`text-black font-bold` : tw`text-gray-800 font-bold`}>X</Text>
                    </TouchableOpacity>
                    <Image source={{uri: product.image}} style={tw`w-3/4 h-3/4 rounded-lg`} resizeMode="contain"/>
                </View>
            </Modal>
        </View>
    );
}
