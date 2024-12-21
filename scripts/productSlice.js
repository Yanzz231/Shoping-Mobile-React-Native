import {createSlice} from '@reduxjs/toolkit';

export const productSlice = createSlice({
    name: 'product',
    initialState: [],
    reducers: {
        setProductStatus: (state, action) => {
            const {productId, status} = action.payload;

            if (state["product-" + productId] === undefined) {
                state["product-" + productId] = {id: productId, status}
            } else {
                state["product-" + productId].status = status;
            }
        },
        toggleProductStatus: (state, action) => {
            const productId = action.payload;

            if (state["product-" + productId] === undefined) {
                state["product-" + productId] = {id: productId, status: false}
            } else {
                state["product-" + productId].status = !state["product-" + productId].status;
            }
        },
    },
});

export const {setProductStatus, toggleProductStatus} = productSlice.actions;
export default productSlice.reducer;
