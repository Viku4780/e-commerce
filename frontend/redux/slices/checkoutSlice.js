import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

// async thunk to create a checkout session
export const createCheckout = createAsyncThunk("checkout/createCheckout", async(checkoutdata, {rejectWithValue}) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
            checkoutdata,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            }
        );
        // console.log("checkout response:",response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {
        addCheckout: (state, action) => {
            state.checkout = action.payload;
            // if(!state.checkout){
            //     state.checkout = {checkoutItems: []};
            // }else{
            //     state.checkout.checkoutItems.push(action.payload);
            // }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckout.fulfilled, (state,action) => {
            state.loading = false;
            state.checkout = action.payload;
        })
        .addCase(createCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    },
});

export const {addCheckout} = checkoutSlice.actions;
export default checkoutSlice.reducer;