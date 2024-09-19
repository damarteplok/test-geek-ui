import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	showErrorToast,
	showSuccessToast,
} from 'Common/Components/Alert/toastHelper';
import { API_URL } from 'Common/constants/urls';
import { CreateUsers } from 'Common/interfaces/create-users.interface';
import { APIClient } from 'helpers/api_helper';
import { USERS, USERS_AVATAR } from 'helpers/url_helper';
import 'react-toastify/dist/ReactToastify.css';

const api = new APIClient();

export const fetchDetailUser = createAsyncThunk(
	'users/fetchDetailUser',
	async ({ id }: { id: string | number }, { rejectWithValue }) => {
		try {
			const response = await api.get(`${API_URL}${USERS}/${id}`, {});
			return response;
		} catch (error) {
			showErrorToast('History User Fetch Failed!');
			return rejectWithValue(error);
		}
	}
);

export const fetchPreviewHistoryUsers = createAsyncThunk(
	'users/fetchPreviewHistoryUsers',
	async (
		{ id, limit }: { id: string | number; limit?: string },
		{ rejectWithValue }
	) => {
		try {
			const params: any = {
				order: 'DESC',
			};
			if (limit) {
				params.limit = 10;
			}
			const response = await api.get(
				`${API_URL}${USERS}/history/${id}`,
				params
			);
			return response;
		} catch (error) {
			showErrorToast('History User Fetch Failed!');
			return rejectWithValue(error);
		}
	}
);

export const fetchUsersClientSide = createAsyncThunk(
	'users/fetchUsersClientSide',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get(`${API_URL}${USERS}/all`, {});
			return response;
		} catch (error) {
			showErrorToast('User Fetch Failed!');
			return rejectWithValue(error);
		}
	}
);

export const fetchUsers = createAsyncThunk(
	'users/fetchUsers',
	async (
		{
			page,
			limit,
			keywords,
			filter,
		}: { page: number; limit: number; keywords?: string; filter?: any },
		{ rejectWithValue }
	) => {
		try {
			const response = await api.get(`${API_URL}${USERS}`, {
				page,
				limit,
				keywords,
				...filter,
			});
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const createUser = createAsyncThunk(
	'users/createUser',
	async (userData: CreateUsers, { rejectWithValue }) => {
		try {
			const response = (await api.create(`${API_URL}${USERS}`, {
				email: userData.email,
				password: userData.password,
				name: userData.name,
				address: userData.address,
				contact: userData.contact,
			})) as any;
			if (response?.id && userData?.img) {
				const formData = new FormData();
				formData.append('file', userData.img);
				const resp = await api.patch(
					`${API_URL}${USERS_AVATAR}/${response.id}`,
					formData
				);
				showSuccessToast('User Create Successfully');
				return resp;
			}
			showSuccessToast('User Create Successfully');
			return response;
		} catch (error) {
			showErrorToast(error);
			return rejectWithValue(error);
		}
	}
);

export const updateUser = createAsyncThunk(
	'users/updateUser',
	async (
		{ id, userData }: { id: string | number; userData: Partial<CreateUsers> },
		{ rejectWithValue }
	) => {
		try {
			const form: any = {
				email: userData.email,
				name: userData.name,
				address: userData.address,
				contact: userData.contact,
			};
			if (userData.password !== null) {
				form.password = userData.password;
			}

			const response = (await api.update(
				`${API_URL}${USERS}/${id}`,
				form
			)) as any;
			if (response?.id && userData?.img) {
				const formData = new FormData();
				formData.append('file', userData.img);
				const resp = await api.patch(
					`${API_URL}${USERS_AVATAR}/${response.id}`,
					formData
				);
				showSuccessToast('User Update Successfully');
				return resp;
			}
			showSuccessToast('User Update Successfully');
			return response;
		} catch (error) {
			showErrorToast('User Update failed!');
			return rejectWithValue(error);
		}
	}
);

export const deleteUser = createAsyncThunk(
	'users/deleteUser',
	async (id: string | number, { rejectWithValue }) => {
		try {
			await api.delete(`${API_URL}${USERS}/${id}`, {});
			showSuccessToast('User deleted Successfully');
			return id;
		} catch (error) {
			showErrorToast('Users delete failed!');
			return rejectWithValue(error);
		}
	}
);
