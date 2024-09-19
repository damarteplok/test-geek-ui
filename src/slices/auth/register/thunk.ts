import { ThunkAction } from 'redux-thunk';
import { RootState } from 'slices';
import { Action, Dispatch } from 'redux';
import { registerFailed, registerSuccess, resetRegister } from './reducer';
import { APIClient } from 'helpers/api_helper';
import { API_URL } from 'Common/constants/urls';
import { AUTH_REGIS } from 'helpers/url_helper';

interface User {
	email: string;
	username?: string;
	password: string;
}

const api = new APIClient();

export const registerUser =
	(user: User): ThunkAction<void, RootState, unknown, Action<string>> =>
	async (dispatch: Dispatch) => {
		try {
			let response: any;
			response = await api.create(`${API_URL}${AUTH_REGIS}`, {
				email: user.email,
				password: user.password,
			});
			if (response) {
				dispatch(registerSuccess(response));
			}
		} catch (error) {
			dispatch(registerFailed(error));
		}
	};

export const resetRegisterFlag = () => {
	try {
		const response = resetRegister(false);
		return response;
	} catch (error) {
		return error;
	}
};
