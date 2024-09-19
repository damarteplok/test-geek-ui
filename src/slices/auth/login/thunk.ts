import { loginError, loginSuccess, logoutSuccess } from './reducer';
import { ThunkAction } from 'redux-thunk';
import { Action, Dispatch } from 'redux';
import { RootState } from 'slices';
import { APIClient } from '../../../helpers/api_helper';
import { API_URL } from '../../../Common/constants/urls';
import { AUTH_LOGIN, AUTH_LOGOUT } from 'helpers/url_helper';

interface User {
	email: string;
	password: string;
}

const api = new APIClient();

export const loginUser =
	(
		user: User,
		history: any
	): ThunkAction<void, RootState, unknown, Action<string>> =>
	async (dispatch: Dispatch) => {
		try {
			let response: any;
			response = await api.create(`${API_URL}${AUTH_LOGIN}`, {
				email: user.email,
				password: user.password,
			});

			if (response) {
				dispatch(loginSuccess(response));
			}
		} catch (error) {
			dispatch(loginError(error));
		}
	};

export const logoutUser = () => async (dispatch: Dispatch) => {
	try {
		let response: any;
		response = await api.create(`${API_URL}${AUTH_LOGOUT}`, {});

		if (response) {
			dispatch(logoutSuccess(true));
		}
	} catch (error) {
		dispatch(loginError(error));
	}
};
