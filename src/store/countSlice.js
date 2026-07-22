import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // client-side state
    cartCount: 8,
    wishlistCount: 0,
    favouritesCount: 0,

    serverState: {}
}

const countSlice = createSlice({
    name: "count",
    initialState,
    reducers: {
        // update any local redux value by key
        setReduxValue(state, action) {
            const { key, value } = action.payload;
            state[key] = value;
        },

        incrementReduxValue(state, action) {
            const { key, by = 1 } = action.payload;
            if (typeof state[key] === "number") {
                state[key] += by;
            }
        },

        decrementReduxValue(state, action) {
            const { key, by = 1 } = action.payload;
            if (typeof state[key] === "number") {
                state[key] -= by;
            }
        },

        setServerState(state, action) {
            state.serverState = {
                ...state.serverState,
                ...action.payload
            }
        }
    }
})

export const { setReduxValue, incrementReduxValue, decrementReduxValue, setServerState } = countSlice.actions;
export default countSlice.reducer;
