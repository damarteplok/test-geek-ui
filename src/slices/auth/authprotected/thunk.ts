import { ThunkAction } from 'redux-thunk';
import { Action, Dispatch } from 'redux';
import { RootState } from 'slices';
import { APIClient } from 'helpers/api_helper';
import { checkAuthFailure, checkAuthStart, checkAuthSuccess } from './reducer';
import { API_URL } from 'Common/constants/urls';
import { AUTH_ISME } from 'helpers/url_helper';
import { profileSuccess } from '../profile/reducer';

const api = new APIClient();

export const checkAuthStatus = (): ThunkAction<
	void,
	RootState,
	unknown,
	Action<string>
> => {
	return async (dispatch: Dispatch) => {
		dispatch(checkAuthStart());
		try {
			const response = await api.create(`${API_URL}${AUTH_ISME}`, {});
			const user = response.data;
			if (!user) {
				dispatch(checkAuthSuccess(false));
			}
			dispatch(checkAuthSuccess(true));
			dispatch(profileSuccess(user));
		} catch (error) {
			dispatch(checkAuthFailure('failed to connect BE'));
		}
	};
};
