import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	fetchIsMe,
	updateAvatarUser,
	updateNotificationSettingsUserProfile,
	updateUserProfile,
} from './thunk';

interface ProfileState {
	user: string;
	error: string | null | unknown;
	success: boolean;
	loading: boolean;
}

const initialState: ProfileState = {
	user: '',
	error: null,
	success: false,
	loading: false,
};

const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		profileSuccess(state: ProfileState, action: PayloadAction<string>) {
			state.user = action.payload;
			state.success = true;
			state.error = null;
		},
		profileFailed(state: ProfileState, action: PayloadAction<string | any>) {
			state.error = action.payload;
			state.success = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIsMe.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIsMe.fulfilled, (state, action: any) => {
				state.loading = false;
				state.user = action.payload.data;
			})
			.addCase(fetchIsMe.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(updateAvatarUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateAvatarUser.fulfilled, (state, action: any) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(updateAvatarUser.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(updateUserProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUserProfile.fulfilled, (state, action: any) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(updateUserProfile.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(updateNotificationSettingsUserProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				updateNotificationSettingsUserProfile.fulfilled,
				(state, action: any) => {
					state.loading = false;
					state.user = action.payload;
				}
			)
			.addCase(
				updateNotificationSettingsUserProfile.rejected,
				(state, action: any) => {
					state.loading = false;
					state.error = action.payload;
				}
			);
	},
});

export const { profileSuccess, profileFailed } = profileSlice.actions;
export default profileSlice.reducer;
