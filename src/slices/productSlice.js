import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllProductApi, getProductApi } from "../service/product";
export const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        pages: {},
        categories: [],
        isPageLoading: false,
        currentCategory: 'all'
    },
    reducers: {
        setCurrentCategory : (state,action) => {
            state.currentCategory = action.payload;
        },
        setProductData: (state,action) => {
            state.products = action.payload.products;
            state.pages = action.payload.pagination;
        },
        setLoading: (state,action) => {
            state.isPageLoading = action.payload;
        },
        setCategories: (state,action) => {
            state.categories = action.payload;
        }
    }
})
export const createAsyncGetProduct = createAsyncThunk(
    'product/createAsyncGetProduct',
    async({page = 1,category = 'all'},{dispatch}) => {
        dispatch(setLoading(true));
        try {
            const res = await getProductApi(page,category);
            dispatch(setProductData(res.data))
        } catch (error) {
            console.log(error);
        }finally{
            dispatch(setLoading(false));
        }
    }
)

export const createAsyncGetAllProducts = createAsyncThunk(
    'product/createAsyncGetAllProducts',
    async(_,{dispatch}) => {
        dispatch(setLoading(true));
        try {
            const res = await getAllProductApi();
            const result = ['all',
                ...new Set(res.data.products.map(product => product.category))
            ];
            dispatch(setCategories(result))
        } catch (error) {
            console.log(error);
        }finally{
            dispatch(setLoading(false));
        }
    }
)

export const {setCurrentCategory,setProductData,setLoading,setCategories} = productSlice.actions;
export default productSlice.reducer;