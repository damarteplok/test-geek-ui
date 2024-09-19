import { postFakeProfile } from 'helpers/fakebackend_helper';
import { profileFailed, profileSuccess } from './reducer';
import { getFirebaseBackend } from 'helpers/firebase_helper';
import { RootState } from 'slices';
import { ThunkAction } from 'redux-thunk';
import { Action, Dispatch } from 'redux';
import { APIClient } from 'helpers/api_helper';
import { API_URL } from 'Common/constants/urls';
import { AUTH_ISME, USERS, USERS_AVATAR } from 'helpers/url_helper';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	showErrorToast,
	showSuccessToast,
} from 'Common/Components/Alert/toastHelper';
import { CreateUsers } from 'Common/interfaces/create-users.interface';

interface User {
	username: string;
	idx: number;
	user?: any;
}

const api = new APIClient();

export const fetchIsMe = createAsyncThunk(
	'profile/fetchIsMe',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.create(`${API_URL}${AUTH_ISME}`, {});
			return response;
		} catch (error) {
			showErrorToast('Profile Fetch Failed!');
			return rejectWithValue(error);
		}
	}
);

export const updateAvatarUser = createAsyncThunk(
	'profile/updateAvatarUser',
	async (
		{ id, img }: { id: string | number; img: any },
		{ rejectWithValue }
	) => {
		try {
			const formData = new FormData();
			formData.append('file', img);
			const response = await api.patch(
				`${API_URL}${USERS_AVATAR}/${id}`,
				formData
			);
			showSuccessToast('Profile Picture Update Successfully');
			return response;
		} catch (error) {
			showErrorToast('Profile Picture Update failed!');
			return rejectWithValue(error);
		}
	}
);

export const updateUserProfile = createAsyncThunk(
	'profile/updateUser',
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

			showSuccessToast('User Update Successfully');
			return response;
		} catch (error) {
			showErrorToast('User Update failed!');
			return rejectWithValue(error);
		}
	}
);

export const updateNotificationSettingsUserProfile = createAsyncThunk(
	'profile/updateNotificationSettingsUserProfile',
	async (
		{ id, settings }: { id: string | number; settings: any },
		{ rejectWithValue }
	) => {
		try {
			const form: any = {
				settings,
			};
			const response = (await api.update(
				`${API_URL}${USERS}/${id}`,
				form
			)) as any;

			showSuccessToast('Notification Settings Update Successfully');
			return response;
		} catch (error) {
			showErrorToast('Notification Settings Update failed!');
			return rejectWithValue(error);
		}
	}
);

export const getIsme = () => async (dispatch: Dispatch) => {
	try {
		let response: any;
		response = await api.create(`${API_URL}${AUTH_ISME}`, {});
		if (response) {
			console.log(response, 'response');
		}
	} catch (error) {
		// dispatch(registerFailed(error));
	}
};

export const editProfile =
	(user: User): ThunkAction<void, RootState, unknown, Action<string>> =>
	async (dispatch: Dispatch) => {
		try {
			let response: any;
			if (process.env.REACT_APP_DEFAULTAUTH === 'fake') {
				response = await postFakeProfile(user);
			} else if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
				const fireBaseBackend = getFirebaseBackend();
				response = await fireBaseBackend.editProfileAPI(
					user.username,
					user.idx
				);
			}

			if (response) {
				dispatch(profileSuccess(response));
			}
		} catch (error) {
			dispatch(profileFailed(error));
		}
	};
