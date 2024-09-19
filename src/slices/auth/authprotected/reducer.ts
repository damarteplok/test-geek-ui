import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
	isAuthenticated: boolean | null;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	isAuthenticated: null,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		checkAuthStart(state) {
			state.loading = true;
			state.error = null;
		},
		checkAuthSuccess(state, action: PayloadAction<boolean>) {
			state.isAuthenticated = action.payload;
			state.loading = false;
            state.error = null;
		},
		checkAuthFailure(state, action: PayloadAction<string>) {
			state.loading = false;
			state.isAuthenticated = false;
			state.error = action.payload;
		},
	},
});

export const { checkAuthStart, checkAuthSuccess, checkAuthFailure } =
	authSlice.actions;
export default authSlice.reducer;
