import { createSlice } from '@reduxjs/toolkit';
import {
	createUser,
	deleteUser,
	fetchDetailUser,
	fetchPreviewHistoryUsers,
	fetchUsers,
	fetchUsersClientSide,
	updateUser,
} from './thunk';

interface UserState {
	users: any[];
	historyUser: any[];
	user: any;
	currentPage: number;
	totalPages: number;
	limit: number;
	loading: boolean;
	error: string | null | unknown;
	errorUser: boolean | null;
	activeUser: number;
	waitingUser: number;
	rejectedUser: number;
}

const initialState: UserState = {
	users: [],
	historyUser: [],
	user: null,
	currentPage: 1,
	totalPages: 0,
	limit: 10,
	loading: false,
	error: null,
	errorUser: null,
	activeUser: 0,
	waitingUser: 0,
	rejectedUser: 0,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, action: any) => {
				state.loading = false;
				state.users = action.payload.results;
				state.currentPage = action.payload.currentPage;
				state.totalPages = action.payload.totalItems;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchUsersClientSide.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsersClientSide.fulfilled, (state, action: any) => {
				state.loading = false;
				state.users = action.payload.map((item: any) => {
					return Object.fromEntries(
						Object.entries(item).map(([key, value]) => [key, value ?? '-'])
					);
				});
				state.activeUser = state.users.filter(
					(user: any) => user.status === 'active'
				).length;
				state.waitingUser = state.users.filter(
					(user: any) => user.status === 'waiting'
				).length;
				state.rejectedUser = state.users.filter(
					(user: any) => user.status === 'rejected'
				).length;
			})
			.addCase(fetchUsersClientSide.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchDetailUser.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.user = null;
			})
			.addCase(fetchDetailUser.fulfilled, (state, action: any) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(fetchDetailUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.user = null;
			})
			.addCase(fetchPreviewHistoryUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.historyUser = [];
			})
			.addCase(fetchPreviewHistoryUsers.fulfilled, (state, action: any) => {
				state.loading = false;
				state.historyUser = action.payload.data.map((item: any) => ({
					title: item.action,
					description: JSON.stringify(item.details),
					date: item.createdAt,
				}));
			})
			.addCase(fetchPreviewHistoryUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.historyUser = [];
			})
			.addCase(createUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createUser.fulfilled, (state, action) => {
				state.users.unshift(action.payload);
				state.loading = false;
				state.errorUser = null;
			})
			.addCase(createUser.rejected, (state, action) => {
				state.error = action.payload;
				state.loading = false;
				state.errorUser = true;
			})
			.addCase(updateUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				const index = state.users.findIndex(
					(user) => user.id === action.payload.id
				);
				if (index !== -1) {
					state.users[index] = action.payload;
				}
				state.loading = false;
				state.errorUser = null;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.error = action.payload;
				state.loading = false;
				state.errorUser = true;
			})
			.addCase(deleteUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				state.users = state.users.filter((user) => user.id !== action.payload);
				state.loading = false;
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.error = action.payload;
				state.loading = false;
			});
	},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
