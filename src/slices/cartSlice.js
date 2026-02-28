import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteAllCartApi, deleteSingleCartApi, getCartApi, postCartApi, updateCartApi } from "../service/cart";
export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        carts: [],
        total: 0,
        final_total: 0
    },
    reducers: {
        updatedCart(state,action){
            state.carts = action.payload.carts || [];
            state.total = action.payload.total;
            state.final_total = action.payload.final_total;
        }
    }
})
export const createAsyncGetCart = createAsyncThunk(
    'cart/createAsyncGetCart',
    async(_,{dispatch}) => {
                try {
            const res = await getCartApi();
            dispatch(updatedCart(res.data.data));
            return res.data;
        } catch (error){
            console.log(error);
            throw error;
        }
    }
)
export const createAsyncAddCart = createAsyncThunk(
    'cart/createAsyncAddCart',
    async({product_id,currentQty},{dispatch}) => {
        try {
            const res = await postCartApi({
                product_id,
                qty: Number(currentQty)
            });
            dispatch(createAsyncGetCart());
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
)
export const createAsyncUpdateCart = createAsyncThunk(
    'cart/createAsyncUpdateCart',
    async({cartId,product_id,qty},{dispatch}) => {
        try {
            const res = await updateCartApi(cartId,{
                product_id,
                qty: Number(qty)
            })
            dispatch(createAsyncGetCart());
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
)
export const createAsyncDeleteSingleCart = createAsyncThunk(
    'cart/createAsyncDeleteSingleCart',
    async(cartId,{dispatch}) => {
        try {
            const res = await deleteSingleCartApi(cartId);
            dispatch(createAsyncGetCart());
            return res.data;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
)
export const createAsyncDeleteAllCart = createAsyncThunk(
    'cart/createAsyncDeleteAllCart',
    async(_,{dispatch}) => {
        try {
            const res = await deleteAllCartApi();
            dispatch(createAsyncGetCart());
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
)
export const {updatedCart} = cartSlice.actions;
export default cartSlice.reducer;