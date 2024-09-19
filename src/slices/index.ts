import { combineReducers } from 'redux';
import LayoutReducer from './layouts/reducer';
import LoginReducer from './auth/login/reducer';
import RegisterReducer from './auth/register/reducer';
import ProfileReducer from './auth/profile/reducer';
import AuthProtectedReducer from './auth/authprotected/reducer';
import UserReducer from './users/reducer';

const appReducer = combineReducers({
	Layout: LayoutReducer,
	Login: LoginReducer,
	Register: RegisterReducer,
	Profile: ProfileReducer,
	AuthProtected: AuthProtectedReducer,
	User: UserReducer,
});

const rootReducer = (state: any, action: any) => {
	if (action.type === 'RESET_STORE') {
		state = undefined;
	}
	return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
